import React, { FormEventHandler, useEffect, useState } from "react";
import { useLoader } from "@common/infrastructure/hooks";
import { Nullable } from "@common/domain/types";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Stack,
  Text,
} from "@common/ui/components";
import { Day } from "@gualet/shared";

import { CategoryReport, GetReportUseCase, Report } from "../..";

interface FetchReportParams {
  getReportUseCase: GetReportUseCase;
  fromDate: string;
  toDate: string;
  setReport: (report: Report) => void;
  setIsLoading: (isLoading: boolean) => void;
}

function fetchReport({
  getReportUseCase,
  fromDate,
  toDate,
  setReport,
  setIsLoading,
}: FetchReportParams) {
  setIsLoading(true);
  return getReportUseCase
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

interface ReportViewProps {
  getReportUseCase: GetReportUseCase;
}

export function ReportView({ getReportUseCase }: ReportViewProps) {
  const today = new Day();
  const [fromDate, setFromDate] = useState(
    today.cloneWithPreviousMonth().toString(),
  );
  const [toDate, setToDate] = useState(today.toString());
  const { isLoading, setIsLoading } = useLoader();
  const [report, setReport] = useState<Nullable<Report>>(null);
  const [expandedIncome, setExpandedIncome] = useState(false);
  const [expandedOutcome, setExpandedOutcome] = useState(false);

  useEffect(() => {
    fetchReport({
      getReportUseCase,
      fromDate,
      toDate,
      setReport,
      setIsLoading,
    }).catch(console.error);
  }, []);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    return fetchReport({
      getReportUseCase,
      fromDate,
      toDate,
      setReport,
      setIsLoading,
    });
  };

  return (
    <Container maxW="1200px" py={6}>
      <Stack gap={6}>
        <Heading as="h2" size="xl">
          Report
        </Heading>

        <Box as="form" onSubmit={onSubmit}>
          <Stack gap={4}>
            <Input
              label="From"
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
            <Input
              label="To"
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
            <Button type="submit" disabled={isLoading} variant="primary">
              {isLoading ? "Fetching..." : "Get report"}
            </Button>
          </Stack>
        </Box>

        {report ? (
          <Stack gap={4}>
            <Box>
              <Text fontSize="lg">
                {`Balance for transactions between ${report.from} and ${report.to}: `}
                <Text
                  as="span"
                  fontWeight="bold"
                  color={report.total >= 0 ? "green.600" : "red.600"}
                >
                  {report.total}
                </Text>
              </Text>
            </Box>
            {!!report.incomeReport.totalByCategories.length && (
              <CategoryReportList
                title="Income"
                report={report.incomeReport}
                isExpanded={expandedIncome}
                onToggle={() => setExpandedIncome(!expandedIncome)}
              />
            )}
            {!!report.outcomeReport.totalByCategories.length && (
              <CategoryReportList
                title="Outcome"
                report={report.outcomeReport}
                isExpanded={expandedOutcome}
                onToggle={() => setExpandedOutcome(!expandedOutcome)}
              />
            )}
          </Stack>
        ) : (
          <Text>No data</Text>
        )}
      </Stack>
    </Container>
  );
}

function CategoryReportList({
  title,
  report,
  isExpanded,
  onToggle,
}: {
  title: string;
  report: CategoryReport;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Box>
      <Button
        variant="ghost"
        w="full"
        justifyContent="space-between"
        onClick={onToggle}
      >
        <Text>
          {title}:{" "}
          <Text
            as="span"
            fontWeight="bold"
            color={report.total >= 0 ? "green.600" : "red.600"}
          >
            {report.total}
          </Text>
        </Text>
        <Text>{isExpanded ? "▼" : "▶"}</Text>
      </Button>
      {isExpanded && (
        <Stack gap={2} pl={4} pt={2}>
          {report.totalByCategories.map(
            ([total, category]: [
              number,
              { id: { toString: () => string }; title: string },
            ]) => (
              <Text key={category.id.toString()}>
                {`${category.title}: ${total}`}
              </Text>
            ),
          )}
        </Stack>
      )}
    </Box>
  );
}
