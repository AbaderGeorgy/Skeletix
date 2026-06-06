import { formatRelativeTime } from "./formatRelativeTime";
import { formatConfidence } from "./reportHelpers";

const toConfidencePercent = (value) => {
  if (value == null || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  return n <= 1 ? n * 100 : n;
};

const averageFromReports = (reports) => {
  const values = reports
    .map((r) => toConfidencePercent(r.confidence))
    .filter((v) => v != null);
  if (!values.length) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

export const buildReportsOverviewMetrics = ({
  apiStats,
  history = [],
  quickResult = null,
}) => {
  const historyCount = history.length;
  const hasQuick = Boolean(quickResult?.prediction);

  const apiCompleted = Number(apiStats?.completedReports) || 0;
  const apiPending = Number(apiStats?.pendingReports) || 0;
  const apiTotal = apiCompleted + apiPending;

  const totalReports = Math.max(apiTotal, historyCount, hasQuick ? 1 : 0);
  const completedReports = Math.max(apiCompleted, historyCount, hasQuick ? 1 : 0);

  const apiAvg = toConfidencePercent(apiStats?.averageConfidence);
  const historyAvg = averageFromReports(history);
  const quickAvg = toConfidencePercent(quickResult?.confidence);

  const avgConfidence =
    Math.max(apiAvg ?? 0, historyAvg ?? 0, quickAvg ?? 0) || null;

  const lastDate =
    history[0]?.createdAt ||
    (hasQuick ? new Date().toISOString() : null);

  const lastAnalysis = lastDate
    ? formatRelativeTime(lastDate)
    : hasQuick
      ? "Just now"
      : "—";

  return {
    totalReports: totalReports > 0 ? totalReports : "—",
    completedReports: completedReports > 0 ? completedReports : "—",
    averageConfidence:
      avgConfidence != null ? formatConfidence(avgConfidence / 100) : "—",
    lastAnalysis,
  };
};
