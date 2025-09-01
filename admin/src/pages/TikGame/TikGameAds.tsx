import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import AdTable from "../../components/tables/AdTable.tsx";
import {constants} from "../../utils/constants.ts";

export default function TikGameAds() {
  return (
    <div>
      <PageMeta
      />
      <PageBreadcrumb pageTitle="Ads" />
      <AdTable site={constants.SITES.TIKGAME} />
    </div>
  );
}
