const { PrismaClient } = require('@prisma/client');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

const prisma = new PrismaClient();

class ReportService {
  static async getJobReport(salonId, startDate, endDate, staffId = null) {
    try {
      const where = {
        salonId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };

      if (staffId) {
        where.staffId = staffId;
      }

      // Get appointment statistics
      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          service: true,
          staff: true,
          customer: true
        }
      });

      const stats = {
        totalJobs: appointments.length,
        completedJobs: appointments.filter(a => a.status === 'COMPLETED').length,
        pendingJobs: appointments.filter(a => a.status === 'SCHEDULED' || a.status === 'CONFIRMED').length,
        cancelledJobs: appointments.filter(a => a.status === 'CANCELLED').length,
        noShowJobs: appointments.filter(a => a.status === 'NO_SHOW').length,
        inProgressJobs: appointments.filter(a => a.status === 'IN_PROGRESS').length
      };

      // Calculate completion rate
      stats.completionRate = stats.totalJobs > 0 ? 
        ((stats.completedJobs / stats.totalJobs) * 100).toFixed(2) : 0;

      // Get cancellation reasons (this would need to be added to the schema)
      const cancellationReasons = {
        'Customer Request': appointments.filter(a => 
          a.status === 'CANCELLED' && a.notes?.includes('customer')
        ).length,
        'Staff Unavailable': appointments.filter(a => 
          a.status === 'CANCELLED' && a.notes?.includes('staff')
        ).length,
        'No Show': stats.noShowJobs,
        'Other': appointments.filter(a => 
          a.status === 'CANCELLED' && 
          !a.notes?.includes('customer') && 
          !a.notes?.includes('staff')
        ).length
      };

      return {
        period: { startDate, endDate },
        staffId,
        statistics: stats,
        cancellationReasons,
        appointments: appointments.map(a => ({
          id: a.id,
          date: a.date,
          service: a.service.name,
          customer: a.customer.name,
          staff: a.staff.name,
          status: a.status,
          notes: a.notes
        }))
      };
    } catch (error) {
      throw new Error(`Job report generation failed: ${error.message}`);
    }
  }

  static async getFinancialReport(salonId, startDate, endDate, staffId = null) {
    try {
      const where = {
        salonId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        },
        status: 'COMPLETED'
      };

      if (staffId) {
        where.staffId = staffId;
      }

      // Get payment statistics
      const payments = await prisma.payment.findMany({
        where,
        include: {
          appointment: {
            include: {
              service: true
            }
          },
          customer: true,
          staff: true
        }
      });

      const totalEarnings = payments.reduce((sum, payment) => 
        sum + parseFloat(payment.amount), 0
      );

      // Group by payment method
      const paymentMethods = {
        CASH: payments.filter(p => p.method === 'CASH').reduce((sum, p) => sum + parseFloat(p.amount), 0),
        CARD: payments.filter(p => p.method === 'CARD').reduce((sum, p) => sum + parseFloat(p.amount), 0),
        DIGITAL_WALLET: payments.filter(p => p.method === 'DIGITAL_WALLET').reduce((sum, p) => sum + parseFloat(p.amount), 0),
        BANK_TRANSFER: payments.filter(p => p.method === 'BANK_TRANSFER').reduce((sum, p) => sum + parseFloat(p.amount), 0)
      };

      // Group by service
      const serviceEarnings = {};
      payments.forEach(payment => {
        if (payment.appointment?.service) {
          const serviceName = payment.appointment.service.name;
          serviceEarnings[serviceName] = (serviceEarnings[serviceName] || 0) + parseFloat(payment.amount);
        }
      });

      // Daily earnings
      const dailyEarnings = {};
      payments.forEach(payment => {
        const date = payment.createdAt.toISOString().split('T')[0];
        dailyEarnings[date] = (dailyEarnings[date] || 0) + parseFloat(payment.amount);
      });

      return {
        period: { startDate, endDate },
        staffId,
        summary: {
          totalEarnings,
          totalTransactions: payments.length,
          averageTransaction: payments.length > 0 ? (totalEarnings / payments.length).toFixed(2) : 0
        },
        paymentMethods,
        serviceEarnings,
        dailyEarnings,
        transactions: payments.map(p => ({
          id: p.id,
          date: p.createdAt,
          amount: parseFloat(p.amount),
          method: p.method,
          customer: p.customer.name,
          staff: p.staff.name,
          service: p.appointment?.service?.name || 'N/A'
        }))
      };
    } catch (error) {
      throw new Error(`Financial report generation failed: ${error.message}`);
    }
  }

  static async getStaffReport(salonId, startDate, endDate, staffId = null) {
    try {
      const where = {
        salonId,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };

      if (staffId) {
        where.staffId = staffId;
      }

      // Get staff performance data
      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          staff: true,
          customer: true,
          service: true,
          payment: true
        }
      });

      const payments = await prisma.payment.findMany({
        where: {
          ...where,
          status: 'COMPLETED'
        },
        include: {
          staff: true
        }
      });

      // Group by staff
      const staffPerformance = {};
      
      appointments.forEach(appointment => {
        const staffName = appointment.staff.name;
        const staffId = appointment.staff.id;
        
        if (!staffPerformance[staffId]) {
          staffPerformance[staffId] = {
            name: staffName,
            servicesCompleted: 0,
            totalEarnings: 0,
            customersServed: new Set(),
            appointments: {
              total: 0,
              completed: 0,
              cancelled: 0,
              noShow: 0
            }
          };
        }

        staffPerformance[staffId].appointments.total++;
        
        if (appointment.status === 'COMPLETED') {
          staffPerformance[staffId].servicesCompleted++;
          staffPerformance[staffId].appointments.completed++;
          staffPerformance[staffId].customersServed.add(appointment.customerId);
        } else if (appointment.status === 'CANCELLED') {
          staffPerformance[staffId].appointments.cancelled++;
        } else if (appointment.status === 'NO_SHOW') {
          staffPerformance[staffId].appointments.noShow++;
        }
      });

      payments.forEach(payment => {
        const staffId = payment.staffId;
        if (staffPerformance[staffId]) {
          staffPerformance[staffId].totalEarnings += parseFloat(payment.amount);
        }
      });

      // Convert Set to count for customers served
      Object.keys(staffPerformance).forEach(staffId => {
        staffPerformance[staffId].customersServed = staffPerformance[staffId].customersServed.size;
        
        // Calculate performance metrics
        const perf = staffPerformance[staffId];
        perf.completionRate = perf.appointments.total > 0 ? 
          ((perf.appointments.completed / perf.appointments.total) * 100).toFixed(2) : 0;
        perf.averageEarningsPerService = perf.servicesCompleted > 0 ? 
          (perf.totalEarnings / perf.servicesCompleted).toFixed(2) : 0;
      });

      return {
        period: { startDate, endDate },
        staffId,
        staffPerformance: Object.values(staffPerformance),
        summary: {
          totalStaff: Object.keys(staffPerformance).length,
          totalServicesCompleted: Object.values(staffPerformance).reduce((sum, s) => sum + s.servicesCompleted, 0),
          totalEarnings: Object.values(staffPerformance).reduce((sum, s) => sum + s.totalEarnings, 0),
          totalCustomersServed: Object.values(staffPerformance).reduce((sum, s) => sum + s.customersServed, 0)
        }
      };
    } catch (error) {
      throw new Error(`Staff report generation failed: ${error.message}`);
    }
  }

  static async getDashboardStats(salonId) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // Today's stats
      const todayAppointments = await prisma.appointment.count({
        where: {
          salonId,
          date: {
            gte: startOfDay,
            lte: endOfDay
          }
        }
      });

      const todayEarnings = await prisma.payment.aggregate({
        where: {
          salonId,
          status: 'COMPLETED',
          createdAt: {
            gte: startOfDay,
            lte: endOfDay
          }
        },
        _sum: {
          amount: true
        }
      });

      // Month's stats
      const monthlyEarnings = await prisma.payment.aggregate({
        where: {
          salonId,
          status: 'COMPLETED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: {
          amount: true
        }
      });

      const totalCustomers = await prisma.customer.count({
        where: { salonId }
      });

      const activeStaff = await prisma.user.count({
        where: {
          salonId,
          isActive: true,
          role: { in: ['OWNER', 'STAFF'] }
        }
      });

      return {
        today: {
          appointments: todayAppointments,
          earnings: parseFloat(todayEarnings._sum.amount || 0)
        },
        monthly: {
          earnings: parseFloat(monthlyEarnings._sum.amount || 0)
        },
        totals: {
          customers: totalCustomers,
          staff: activeStaff
        }
      };
    } catch (error) {
      throw new Error(`Dashboard stats generation failed: ${error.message}`);
    }
  }
}

module.exports = ReportService;