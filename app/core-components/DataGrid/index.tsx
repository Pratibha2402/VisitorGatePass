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

export type { GridColDef, GridRowsProp } from "@mui/x-data-grid";
