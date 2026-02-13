import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationComp({ countPage, page, setPage }) {
  return (
    <Stack spacing={2}>
      <Pagination
        count={countPage}
        variant="outlined"
        page={page}
        onChange={(e, value) => setPage(value)}
      />
    </Stack>
  );
}
