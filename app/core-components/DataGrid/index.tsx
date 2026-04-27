// @ts-nocheck
/** @jsxImportSource @emotion/react */

/**
 *
 * DataGrid Component
 *
 */
import {
  DataGrid as MUIDataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbar,
  DataGridProps,
  GridRowModes,
  type GridRowModesModel,
  type GridRowId,
  GridActionsCellItem,
  type GridEventListener,
  type GridRowParams,
  type GridPreProcessEditCellProps,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

function DataGrid(props: DataGridProps) {
  const { rows, columns, slots, ...rest } = props;
  let defaultSlots = undefined;
  if (!slots) {
    defaultSlots = {
      toolbar: GridToolbar,
    };
  }

  return (
    <MUIDataGrid
      rows={rows}
      columns={columns}
      autoHeight
      getRowHeight={() => "auto"}
      slots={slots || defaultSlots}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
      {...rest}
    />
  );
}

export default DataGrid;
export {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbar,
};

export {
  GridColDef,
  GridRowsProp,
  GridRowModes,
  GridRowEditStopReasons,
  GridActionsCellItem,
};

export type {
  GridRowModesModel,
  GridRowId,
  GridEventListener,
  GridRowParams,
  GridPreProcessEditCellProps,
};
