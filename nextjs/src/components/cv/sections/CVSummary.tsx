interface CVSummaryProps {
  summary: string;
}

const CVSummary = ({ summary }: CVSummaryProps) => {
  return (
    <div className="cv-section cv-summary">
      <h2>Professional Summary</h2>
      <p>{summary}</p>
    </div>
  );
};

export default CVSummary;
