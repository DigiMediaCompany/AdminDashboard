import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb.tsx";
import WebsiteInfoCard from "../../components/UserProfile/WebsiteInfoCard.tsx";
import {constants} from "../../utils/constants.ts";


export default function TikGameInfo() {
    return (
        <>
            <PageMeta
            />
            <PageBreadcrumb pageTitle="Info" />
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                    Basic Website Information
                </h3>
                <div className="space-y-6">
                    <WebsiteInfoCard site={constants.SITES.TIKGAME} />
                </div>
            </div>
        </>
    );
}
