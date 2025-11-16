import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// @mui
import {
  Card,
  Table,
  Button,
  TableBody,
  Container,
  TableContainer,
} from '@mui/material';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
import ConfirmDialog from '../../../components/confirm-dialog';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
// sections
import RecipeTableRow from '../../../sections/@dashboard/recipe/RecipeTableRow';
import RecipeTableToolbar from '../../../sections/@dashboard/recipe/RecipeTableToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Recipe Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'total_cost', label: 'Total Cost', align: 'right' },
  { id: '', label: 'Actions', align: 'right' },
];

// ----------------------------------------------------------------------

RecipeManagementPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function RecipeManagementPage() {
  const router = useRouter();
  const { themeStretch } = useSettingsContext();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    selected,
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes`);
      const result = await response.json();

      if (result.success) {
        setTableData(result.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleDeleteRow = (id) => {
    setDeleteId(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${deleteId}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.success) {
        fetchRecipes();
        setOpenConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleEditRow = (id) => {
    router.push(`/dashboard/recipes/creation?id=${id}`);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered = filterName !== '';

  const isNotFound = !dataFiltered.length && isFiltered;

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Recipe Management"
        links={[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Recipes', href: '/dashboard/recipes/list' },
          { name: 'List' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => router.push('/dashboard/recipes/creation')}
          >
            Add Recipe
          </Button>
        }
      />

      <Card>
        <RecipeTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          onFilterName={handleFilterName}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={tableData.length}
                numSelected={selected.length}
                onSort={onSort}
              />

              <TableBody>
                {dataInPage.map((row) => (
                  <RecipeTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onDeleteRow={() => handleDeleteRow(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
                />

                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
          dense={dense}
          onChangeDense={onChangeDense}
        />
      </Card>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure you want to delete this recipe?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        }
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (recipe) =>
        recipe.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        (recipe.description &&
          recipe.description.toLowerCase().indexOf(filterName.toLowerCase()) !== -1)
    );
  }

  return inputData;
}
