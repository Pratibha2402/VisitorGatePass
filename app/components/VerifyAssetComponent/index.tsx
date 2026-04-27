"use client";

import {
  postAssetVerification,
  saveVerificationRemarks,
} from "@/app/(main)/user/verify-asset/api";
import { groupBy } from "@/client-helper";
import {
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Icon,
} from "@/core-components";
import DataGrid from "@/core-components/DataGrid";
import { VERIFICATION_STATUS } from "@/enums";
import { Domain, ExpandMore } from "@mui/icons-material";
import { TextField, Tooltip } from "@mui/material";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

export const getGroupedUserAssetList = (userAssetList: any) => {
  return groupBy(
    userAssetList.map((al: any) => ({
      ...al,
      assetType: al.Asset.AssetModel.AssetDescription.assetType,
    })),
    "assetType"
  );
};

export const getGroupedUserDepartmentAssetList = (
  userDepartmentAssetList: any
) => {
  return groupBy(
    userDepartmentAssetList.map((al: any) => ({
      ...al,
      assetType: al.Asset.AssetModel.AssetDescription.assetType,
    })),
    "assetType"
  );
};
const COLUMN_TYPE = {
  ME: "ME",
  DEPARTMENT: "DEPARTMENT",
};
const columns = ({
  setVerifyingIncludedAsset,
  verifyingIncludedAsset,
  setVerifyingExcludedAsset,
  verifyingExcludedAsset,
  setVerifyingAllocatedAsset,
  verifyingAllocatedAsset,
  columnType,
  loggedInUser,
}: any) => [
  {
    field: "assetId",
    headerName: "Asset ID",
    headerClassName: "p-4",
    renderCell: (params: any) => (
      <Link
        href={"/asset/" + params.value}
        className="text-blue-700 hover:underline"
      >
        {params.value}
      </Link>
    ),
    flex: 1,
  },
  {
    field: "assetDescription",
    headerName: "Asset Description",
    headerClassName: "p-4",
    flex: 1,
  },
  {
    field: "makeModel",
    headerName: "Make & Model",
    headerClassName: "p-4",
    flex: 2,
  },
  {
    field: "location",
    headerName: "Location",
    headerClassName: "p-4",
    flex: 2,
  },
  {
    field: "verify",
    headerName: "Verify",
    headerClassName: "p-4",
    flex: 4,
    // headerAlign: "center",
    renderCell: (params: any) => {
      const { assetId, verified } = params.row;
      if (verified?.assetId) {
        return (
          <div className="flex items-center">
            <Chip
              color={
                verified?.verificationStatus === VERIFICATION_STATUS.INCLUDED
                  ? "success"
                  : verified?.verificationStatus ===
                      VERIFICATION_STATUS.EXCLUDED
                    ? "error"
                    : "warning"
              }
              label={
                <div>
                  {verified?.verificationStatus ===
                  VERIFICATION_STATUS.ALLOCATED_TO_YOU
                    ? `ALLOCATED_TO _${verified.verifier?.name}`
                    : verified?.verificationStatus}
                </div>
              }
            />
            <div className="ml-2 font-bold">
              by {verified.verifier?.name} ({verified.verifier?.empNo})
            </div>
          </div>
        );
      }

      return (
        <div className="flex gap-2">
          <Tooltip title="Confirm this asset.">
            <Button
              variant="outlined"
              color="success"
              onClick={async () => {
                setVerifyingIncludedAsset([...verifyingIncludedAsset, assetId]);
                const response = await postAssetVerification(
                  assetId,
                  VERIFICATION_STATUS.INCLUDED
                );
                if (response) {
                  toast.info(
                    `Asset "${assetId}" has been included successfully!`
                  );
                } else {
                  toast.error(
                    `Something went wrong while verifying the asset!`
                  );
                }
                setVerifyingIncludedAsset(
                  verifyingIncludedAsset.filter((aId: any) => assetId === aId)
                );
              }}
              loading={verifyingIncludedAsset.some(
                (aId: any) => aId === assetId
              )}
              disabled={
                verifyingExcludedAsset.some((aId: any) => aId === assetId) ||
                verifyingAllocatedAsset.some((aId: any) => aId === assetId)
              }
            >
              Include
            </Button>
          </Tooltip>
          <Tooltip title="Remove the asset from this list.">
            <Button
              variant="outlined"
              color="error"
              onClick={async () => {
                setVerifyingExcludedAsset([...verifyingExcludedAsset, assetId]);
                const response = await postAssetVerification(
                  assetId,
                  VERIFICATION_STATUS.EXCLUDED
                );
                if (response) {
                  toast.info(
                    `Asset "${assetId}" has been excluded successfully!`
                  );
                } else {
                  toast.error(
                    `Something went wrong while verifying the asset!`
                  );
                }
                setVerifyingExcludedAsset(
                  verifyingExcludedAsset.filter((aId: any) => assetId === aId)
                );
              }}
              loading={verifyingExcludedAsset.some(
                (aId: any) => aId === assetId
              )}
              disabled={
                verifyingIncludedAsset.some((aId: any) => aId === assetId) ||
                verifyingAllocatedAsset.some((aId: any) => aId === assetId)
              }
            >
              Exclude
            </Button>
          </Tooltip>
          <Button
            variant="outlined"
            color="warning"
            onClick={async () => {
              setVerifyingAllocatedAsset([...verifyingAllocatedAsset, assetId]);
              const response = await postAssetVerification(
                assetId,
                columnType === COLUMN_TYPE.ME
                  ? VERIFICATION_STATUS.ALLOCATED_TO_DEPARTMENT
                  : VERIFICATION_STATUS.ALLOCATED_TO_YOU
              );
              if (response) {
                toast.info(
                  `Asset "${assetId}" has been allocated successfully!`
                );
              } else {
                toast.error(`Something went wrong while verifying the asset!`);
              }
              setVerifyingAllocatedAsset(
                verifyingAllocatedAsset.filter((aId: any) => assetId === aId)
              );
            }}
            loading={verifyingAllocatedAsset.some(
              (aId: any) => aId === assetId
            )}
            disabled={
              verifyingIncludedAsset.some((aId: any) => aId === assetId) ||
              verifyingExcludedAsset.some((aId: any) => aId === assetId)
            }
          >
            Allocate to{" "}
            {columnType === COLUMN_TYPE.ME
              ? COLUMN_TYPE.DEPARTMENT
              : COLUMN_TYPE.ME}
          </Button>
        </div>
      );
    },
  },
];

const getFormattedRows = (rows: any, verifiedAssetList: any) =>
  rows.map((row: any) => ({
    id: row.assetId,
    assetId: row.assetId,
    assetDescription: `${row.Asset.AssetModel.AssetDescription?.assetDescriptionText}`,
    makeModel: `${row.Asset.AssetModel.makeModel}`,
    location: row.location,
    verified:
      verifiedAssetList?.find((asset: any) => asset.assetId === row.assetId) ||
      false,
  }));

export default function VerifyAssetComponent(props: any) {
  const {
    userDepartmentAssetList,
    userAssetList,
    loggedInUser,
    verifiedAssetList,
    verificationRemark,
  } = props;
  const groupedUserAssetList = getGroupedUserAssetList(userAssetList);
  const groupedUserDepartmentAssetList = getGroupedUserDepartmentAssetList(
    userDepartmentAssetList
  );

  const [verifyingIncludedAsset, setVerifyingIncludedAsset] = React.useState(
    []
  );
  const [verifyingExcludedAsset, setVerifyingExcludedAsset] = React.useState(
    []
  );
  const [verifyingAllocatedAsset, setVerifyingAllocatedAsset] = React.useState(
    []
  );

  // const [remarks, setRemarks] = React.useState();
  return (
    <div className="mx-auto flex w-full flex-col gap-8 p-8">
      <Paper elevation={4} className="flex w-full flex-col gap-4 p-8">
        {!!userAssetList.length ? (
          <>
            <div className="flex items-center gap-2 text-2xl font-bold text-indigo-800">
              <Domain />
              <div className="">
                Assets allocated to you (
                {`${loggedInUser?.name} • ${loggedInUser?.designation} • [${loggedInUser?.username}]`}
                ).
              </div>
            </div>
            {Object.entries(groupedUserAssetList).map(([key, value]: any) => (
              <Accordion
                key={key}
                // defaultExpanded
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  className="font-bold"
                >
                  <Icon className="mr-2 font-material_icons font-normal leading-6">
                    {value[0].Asset.AssetModel.AssetDescription.assetIcon}
                  </Icon>
                  {key} ({value.length})
                </AccordionSummary>
                <AccordionDetails>
                  <DataGrid
                    columns={columns({
                      setVerifyingIncludedAsset,
                      verifyingIncludedAsset,
                      setVerifyingExcludedAsset,
                      verifyingExcludedAsset,
                      setVerifyingAllocatedAsset,
                      verifyingAllocatedAsset,
                      columnType: COLUMN_TYPE.ME,
                      loggedInUser,
                    })}
                    rows={getFormattedRows(value, verifiedAssetList)}
                    getCellClassName={() => "p-4"}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        ) : (
          <div className="flex items-center gap-2 text-xl">
            <Domain />
            <div>No assets allocated to you.</div>
          </div>
        )}
      </Paper>
      <Paper elevation={4} className="flex w-full flex-col gap-4 p-8">
        {/* User Department asset list */}
        {!!userDepartmentAssetList.length ? (
          <>
            <div className="flex items-center gap-2 text-2xl font-bold text-indigo-800">
              <Domain />
              <div className="">
                Shared assets allocated to your department (
                {loggedInUser.department}).
              </div>
            </div>
            {Object.entries(groupedUserDepartmentAssetList).map(
              ([key, value]: any) => (
                <Accordion
                  key={key}
                  // defaultExpanded
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="font-bold"
                  >
                    <Icon className="mr-2 font-material_icons font-normal leading-6">
                      {value[0].Asset.AssetModel.AssetDescription.assetIcon}
                    </Icon>
                    {key} ({value.length})
                  </AccordionSummary>
                  <AccordionDetails>
                    <DataGrid
                      columns={columns({
                        setVerifyingIncludedAsset,
                        verifyingIncludedAsset,
                        setVerifyingExcludedAsset,
                        verifyingExcludedAsset,
                        setVerifyingAllocatedAsset,
                        verifyingAllocatedAsset,
                        columnType: COLUMN_TYPE.DEPARTMENT,
                        loggedInUser,
                      })}
                      rows={getFormattedRows(value, verifiedAssetList)}
                      getCellClassName={() => "p-4"}
                    />
                  </AccordionDetails>
                </Accordion>
              )
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-xl">
            <Domain />
            <div>
              No shared assets allocated to your department (
              {loggedInUser.department}).
            </div>
          </div>
        )}
      </Paper>
      <Paper elevation={4} className="flex w-full flex-col gap-4 p-8">
        <div className="flex items-center gap-2 text-2xl font-bold text-indigo-800">
          <Domain />
          <div className="">
            If there are any other asset with you or your department , please
            provide details.
          </div>
        </div>
        <Accordion
        // defaultExpanded
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
            className="font-bold"
          >
            Please enter asset type, asset location and asset owner.
          </AccordionSummary>
          <AccordionDetails>
            <VerificationRemark verificationRemark={verificationRemark} />
          </AccordionDetails>
        </Accordion>
      </Paper>
    </div>
  );
}

function VerificationRemark(props: any) {
  const { verificationRemark } = props;
  const [remarks, setRemarks] = React.useState(
    verificationRemark?.remarks || ""
  );
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      <TextField
        multiline
        rows={5}
        label={"Remarks"}
        fullWidth
        value={remarks}
        onChange={(e: any) => {
          setRemarks(e.target.value);
        }}
      />
      <Button
        fullWidth
        variant="contained"
        className="mt-4"
        onClick={async () => {
          setLoading(true);
          const res = await saveVerificationRemarks(remarks);
          if (!res) {
            toast.error("Something went wrong!");
          }
          toast.success("The remarks has been saved successfully!");
          setLoading(false);
          setRemarks("");
        }}
        loading={loading}
      >
        Submit
      </Button>
    </>
  );
}
