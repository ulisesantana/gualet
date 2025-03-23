import React, { FormEventHandler, useEffect, useState } from "react";
import { useRepositories } from "@infrastructure/ui/hooks";
import { CategoryReport, Day, Report } from "@domain/models";
import { GetReportUseCase } from "@application/cases";
import { Nullable } from "@domain/types";
import { TransactionRepository } from "@application/repositories";

import "./ReportView.css";

interface FetchReportParams {
  transactionRepository: TransactionRepository;
  fromDate: string;
  toDate: string;
  setReport: (report: Report) => void;
  setIsLoading: (isLoading: boolean) => void;
}

function fetchReport({
  transactionRepository,
  fromDate,
  toDate,
  setReport,
  setIsLoading,
}: FetchReportParams) {
  setIsLoading(true);
  return new GetReportUseCase(transactionRepository)
    .exec({ from: new Day(fromDate), to: new Day(toDate) })
    .then(setReport)
    .catch((error) => {
      console.error("Error getting report.");
      console.error(error);
    })
    .finally(() => {
      setIsLoading(false);
    });
}

export function ReportView() {
  const today = new Day();
  const [fromDate, setFromDate] = useState(
    today.cloneWithPreviousMonth().toString(),
  );
  const [toDate, setToDate] = useState(today.toString());
  const { isReady, repositories, isLoading, setIsLoading } = useRepositories();
  const [report, setReport] = useState<Nullable<Report>>(null);

  useEffect(() => {
    if (isReady && repositories) {
      fetchReport({
        transactionRepository: repositories.transaction,
        fromDate,
        toDate,
        setReport,
        setIsLoading,
      });
    }
  }, [isReady]);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (repositories) {
      return fetchReport({
        transactionRepository: repositories.transaction,
        fromDate,
        toDate,
        setReport,
        setIsLoading,
      });
    }
  };

  return (
    <div className="report-view">
      <h2>Report</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="fromDate">From:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="toDate">To:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Fetching..." : "Get report"}
        </button>
      </form>

      {report ? (
        <>
          <h3 className="balance">
            {`Balance for transactions between ${report.from} and ${report.to}: `}
            <span className={report.total >= 0 ? "income" : "outcome"}>
              {report.total}
            </span>
          </h3>
          {!!report.incomeReport.totalByCategories.length && (
            <CategoryReportList title="Income" report={report.incomeReport} />
          )}
          {!!report.outcomeReport.totalByCategories.length && (
            <CategoryReportList title="Outcome" report={report.outcomeReport} />
          )}
        </>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
}

function CategoryReportList({
  title,
  report,
}: {
  title: string;
  report: CategoryReport;
}) {
  return (
    <details>
      <summary role="button">
        {title}:{" "}
        <span className={report.total >= 0 ? "income" : "outcome"}>
          {report.total}
        </span>
      </summary>
      <ul>
        {report.totalByCategories.map(([total, category]) => (
          <li key={category.id.toString()}>{`${category.title}: ${total}`}</li>
        ))}
      </ul>
    </details>
  );
}
