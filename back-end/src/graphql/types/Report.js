const { gql } = require('apollo-server-express');

const reportTypes = gql`
  type JobReport {
    period: ReportPeriod!
    staffId: String
    statistics: JobStatistics!
    cancellationReasons: CancellationReasons!
    appointments: [AppointmentSummary!]!
  }

  type FinancialReport {
    period: ReportPeriod!
    staffId: String
    summary: FinancialSummary!
    paymentMethods: PaymentMethodBreakdown!
    serviceEarnings: ServiceEarningsBreakdown!
    dailyEarnings: DailyEarningsBreakdown!
    transactions: [TransactionSummary!]!
  }

  type StaffReport {
    period: ReportPeriod!
    staffId: String
    staffPerformance: [StaffPerformance!]!
    summary: StaffSummary!
  }

  type DashboardStats {
    today: TodayStats!
    monthly: MonthlyStats!
    totals: TotalStats!
  }

  type ReportPeriod {
    startDate: Date!
    endDate: Date!
  }

  type JobStatistics {
    totalJobs: Int!
    completedJobs: Int!
    pendingJobs: Int!
    cancelledJobs: Int!
    noShowJobs: Int!
    inProgressJobs: Int!
    completionRate: String!
  }

  type CancellationReasons {
    customerRequest: Int!
    staffUnavailable: Int!
    noShow: Int!
    other: Int!
  }

  type AppointmentSummary {
    id: ID!
    date: Date!
    service: String!
    customer: String!
    staff: String!
    status: AppointmentStatus!
    notes: String
  }

  type FinancialSummary {
    totalEarnings: Float!
    totalTransactions: Int!
    averageTransaction: String!
  }

  type PaymentMethodBreakdown {
    cash: Float!
    card: Float!
    digitalWallet: Float!
    bankTransfer: Float!
  }

  type ServiceEarningsBreakdown {
    serviceName: String!
    earnings: Float!
  }

  type DailyEarningsBreakdown {
    date: Date!
    earnings: Float!
  }

  type TransactionSummary {
    id: ID!
    date: DateTime!
    amount: Float!
    method: PaymentMethod!
    customer: String!
    staff: String!
    service: String!
  }

  type StaffPerformance {
    name: String!
    servicesCompleted: Int!
    totalEarnings: Float!
    customersServed: Int!
    appointments: StaffAppointmentStats!
    completionRate: String!
    averageEarningsPerService: String!
  }

  type StaffAppointmentStats {
    total: Int!
    completed: Int!
    cancelled: Int!
    noShow: Int!
  }

  type StaffSummary {
    totalStaff: Int!
    totalServicesCompleted: Int!
    totalEarnings: Float!
    totalCustomersServed: Int!
  }

  type TodayStats {
    appointments: Int!
    earnings: Float!
  }

  type MonthlyStats {
    earnings: Float!
  }

  type TotalStats {
    customers: Int!
    staff: Int!
  }
`;

module.exports = reportTypes;