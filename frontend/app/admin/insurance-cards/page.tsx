import React from "react";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumb";
import { InsuranceCardTable } from "../components/Tables/insurance-card-table";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insurance Cards",
};

const TablesPage = () => {
  return (
    <>
      <Breadcrumb pageName="Insurance Cards" />

      <div className="space-y-10">
        {/* <Suspense fallback={<TopChannelsSkeleton />}>
          <TopChannels />
        </Suspense>

        <Suspense fallback={<TopProductsSkeleton />}>
          <TopProducts />
        </Suspense> */}

        <InsuranceCardTable />
      </div>
    </>
  );
};

export default TablesPage;
