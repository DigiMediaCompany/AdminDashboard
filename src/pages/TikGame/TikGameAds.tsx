import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AdTable from "../../components/tables/AdTable.tsx";
import {constants} from "../../utils/constants.ts";

export default function TikGameAds() {
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Ads" />
      <AdTable site={constants.SITES.TIKGAME} />
    </div>
  );
}
