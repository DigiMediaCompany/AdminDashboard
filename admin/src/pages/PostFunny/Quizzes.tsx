import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import QuizTable from "../../components/tables/QuizTable.tsx";

export default function Quizzes() {
  return (
    <>
      <PageMeta
      />
      <PageBreadcrumb pageTitle="Quizzes" />
      <div className="space-y-6">
        <ComponentCard title="Table 'quizzes'">
          <QuizTable />
        </ComponentCard>
      </div>
    </>
  );
}
