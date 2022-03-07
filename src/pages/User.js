import { filter, set } from "lodash";
import { sentenceCase } from "change-case";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import AppUrl from "../API/AppUrl";
import RestClient from "../API/RestClient";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import swal from "sweetalert";

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import Iconify from "../components/Iconify";
import SearchNotFound from "../components/SearchNotFound";
import {
  UserListHead,
  UserListToolbar,
  UserMoreMenu,
} from "../sections/@dashboard/user";
import axios from "axios";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "name", label: "Tên truyện", alignRight: false },
  { id: "price", label: "Giá tiền", alignRight: false },
  { id: "author", label: "Tác giả", alignRight: false },
  { id: "origin", label: "Xuất xứ", alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.long_title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: "none",
    },
    button: {
      background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      margin: "10px 2px",
      color: "white",
      borderRadius: 3,
      border: 0,
    },
    button2: {
      margin: "10px 2px",
      color: "white",
      borderRadius: 3,
      border: 0,
    },
  })
);

export default function User() {
  
 
  const classes = useStyles();
  //console.log(USERLIST);
  const [openAdditem, setOpenAddItem] = useState(false);
  const [openEditItem, setOpenEditItem] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [comicData, setComicData] = useState([]);
  const [urlImage, setUrlImage] = useState("");
  const [image, setImage] = useState("");
  const [dataRowComic,setDataRowComic] = useState({});
  const [dataAddItem, setDataAddItem] = useState({
    short_img: "",
    short_title: "",
    short_description: "",
    long_title: "",
    long_description: "",
    total_buy: "",
    type_comic: "",
    tag_comic: "",
    author_comic: "",
    price_comic: "",
  });
  const handleClickOpenAddItem = () => {
    setOpenAddItem(true);
  };

  const handleCloseAddItem = () => {
    setOpenAddItem(false);
  };
  const handleClickOpenEditItem = () => {
    setOpenEditItem(true);
  };

  const handleCloseEditItem = () => {
    setOpenEditItem(false);
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const getData = () => {
    RestClient.GetRequest(AppUrl.AllComicData + "")
      .then((result) => {
        setComicData(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const handleDeleteComic = () => {
    getData();
  };
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comicData.length) : 0;

  const filteredUsers = applySortFilter(
    comicData,
    getComparator(order, orderBy),
    filterName
  );
  const handleUploadFile = (e) => {
    console.log('handleUploadFile');
    e.preventDefault();

    const data = new FormData();
    data.append("images[]", image);

    axios
      .post("https://api.restapi-vs.top/api/images", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDataAddItem((prevState) => {
            return {
              ...prevState,
              short_img: response.data.message,
            };
          });
          setUrlImage(response.data.message);
          setDataRowComic((prevState) => {
            return { ...prevState, short_img: response.data.message };
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleShortTitle = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, short_title: e.target.value };
    });
  };
  const handleShortDescription = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, short_description: e.target.value };
    });
  };
  const handleLongTitle = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, long_title: e.target.value };
    });
  };
  const handleLongDescription = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, long_description: e.target.value };
    });
  };
  const handleTypeComic = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, type_comic: e.target.value };
    });
  };
  const handleTagComic = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, tag_comic: e.target.value };
    });
  };
  const handleAuthorComic = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, author_comic: e.target.value };
    });
  };
  const handlePriceComic = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, price_comic: e.target.value };
    });
  };
  const handleTotalBuy = (e) => {
    setDataAddItem((prevState) => {
      return { ...prevState, total_buy: e.target.value };
    });
  };
  const handleEditShortTitle = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, short_title: e.target.value };
    });
  };
  const handleEditShortDescription = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, short_description: e.target.value };
    });
  };
  const handleEditLongTitle = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, long_title: e.target.value };
    });
  };
  const handleEditLongDescription = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, long_description: e.target.value };
    });
  };
  const handleEditTypeComic = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, type_comic: e.target.value };
    });
  };
  const handleEditTagComic = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, tag_comic: e.target.value };
    });
  };
  const handleEditAuthorComic = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, author_comic: e.target.value };
    });
  };
  const handleEditPriceComic = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, price_comic: e.target.value };
    });
  };
  const handleEditTotalBuy = (e) => {
    setDataRowComic((prevState) => {
      return { ...prevState, total_buy: e.target.value };
    });
  };
  const handleAddComic = () => {
    if (
      dataAddItem.short_title.trim() === "" ||
      dataAddItem.short_description.trim() === "" ||
      dataAddItem.short_img.trim() === "" ||
      dataAddItem.long_title.trim() === "" ||
      dataAddItem.long_description.trim() === "" ||
      dataAddItem.total_buy.trim() === "" ||
      dataAddItem.type_comic.trim() === "" ||
      dataAddItem.tag_comic.trim() === "" ||
      dataAddItem.author_comic.trim() === "" ||
      dataAddItem.price_comic.trim() === ""
    ) {
      swal("Lỗi!", "Không được để trống các trường", "error");
      return;
    }
    RestClient.PostRequest(AppUrl.AddNewComic, JSON.stringify(dataAddItem))
      .then((result) => {
        if (result === 1) {
          swal("Chúc mừng!", "Thêm truyện mới thành công", "success");
          setDataAddItem({});
          handleCloseAddItem();
          getData();
          setUrlImage("");
        } else {
          swal("Lỗi!", "Thêm thất bại", "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSaveEditComic = () => {
    
    
    RestClient.PostRequest(AppUrl.UpdateComic, JSON.stringify(dataRowComic))
      .then((result) => {
        if (result === 1) {
          swal("Chúc mừng!", "Sửa thành công", "success");
          setDataRowComic({});
          handleCloseEditItem();
          getData();
          setUrlImage("");
        } else {
          
          swal("Lỗi!", "sửa thất bại", "error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const isUserNotFound = filteredUsers.length === 0;
  const handleEditComic =(data)=>{
     setDataRowComic(data);
     handleClickOpenEditItem();
  }
  return (
    <Page title="Comics">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Comics
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="#"
            onClick={handleClickOpenAddItem}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Thêm comic
          </Button>
        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={comicData.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  // onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const {
                        id,
                        long_title,
                        price_comic,
                        author_comic,
                        type_comic,
                      } = row;
                      const isItemSelected =
                        selected.indexOf(long_title) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                         
                          <TableCell component="th" scope="row">
                            {/* <Avatar alt={name} src={avatarUrl} /> */}
                            <Typography variant="subtitle2" noWrap>
                              {long_title}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{price_comic}</TableCell>
                         
                          <TableCell align="left">
                            <Label variant="ghost" color="success">
                              {author_comic}
                            </Label>
                          </TableCell>
                          <TableCell align="left">
                            <Label variant="ghost">{type_comic}</Label>
                          </TableCell>

                          <TableCell align="right">
                            <UserMoreMenu
                              id={id}
                              deleteComic={handleDeleteComic}
                              editComic={handleEditComic}
                              dataComic={row}
                              
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={comicData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {/* ===========Dialog AddItem================== */}
        <Dialog open={openAdditem} onClose={handleCloseAddItem}>
          <DialogTitle>Add new comics</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="short_title"
              label="short_title"
              type="text"
              onChange={handleShortTitle}
              value={dataAddItem.short_title}
              fullWidth
              variant="standard"
              
            />
            
            <TextField
              
              autoFocus
              margin="dense"
              id="short_description"
              label="short_description"
              type="text"
              onChange={handleShortDescription}
              value={dataAddItem.short_description}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="long_title"
              label="long_title"
              type="text"
              onChange={handleLongTitle}
              value={dataAddItem.long_title}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="long_description"
              label="long_description"
              type="text"
              onChange={handleLongDescription}
              value={dataAddItem.long_description}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="type_comic"
              label="type_comic"
              type="text"
              onChange={handleTypeComic}
              value={dataAddItem.type_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="tag_comic"
              label="tag_comic"
              type="text"
              onChange={handleTagComic}
              value={dataAddItem.tag_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="author_comic"
              label="author_comic"
              type="text"
              onChange={handleAuthorComic}
              value={dataAddItem.author_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="price_comic"
              label="price_comic"
              type="text"
              onChange={handlePriceComic}
              value={dataAddItem.price_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="total_buy"
              label="total_buy"
              type="text"
              fullWidth
              onChange={handleTotalBuy}
              value={dataAddItem.total_buy}
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="short_img"
              type="text"
              value={dataAddItem.short_img}
              fullWidth
              variant="standard"
              disabled
            />
            <Button
              variant="contained"
               onClick={handleAddComic}
              className={classes.button2}
            >
              Add new comic
            </Button>
            <form
              onSubmit={handleUploadFile}
              encType="multipart/form-data"
              className="formUpload"
            >
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="contained-button-file">
                <Button className={classes.button} component="span">
                  Select
                </Button>
              </label>
              <Button className={classes.button} type="submit">
                Upload
              </Button>
            </form>
            <img src={urlImage} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddItem}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* ===========End AddItem================== */}
         {/* ===========Dialog Edit Item================= */}
         <Dialog open={openEditItem} onClose={handleCloseEditItem}>
          <DialogTitle>Edit comic</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="short_title"
              label="short_title"
              type="text"
              onChange={handleEditShortTitle}
              value={dataRowComic.short_title}
              fullWidth
              variant="standard"
              
            />
            
            <TextField
              
              autoFocus
              margin="dense"
              id="short_description"
              label="short_description"
              type="text"
              onChange={handleEditShortDescription}
              value={dataRowComic.short_description}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="long_title"
              label="long_title"
              type="text"
              onChange={handleEditLongTitle}
              value={dataRowComic.long_title}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="long_description"
              label="long_description"
              type="text"
              onChange={handleEditLongDescription}
              value={dataRowComic.long_description}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="type_comic"
              label="type_comic"
              type="text"
              onChange={handleEditTypeComic}
              value={dataRowComic.type_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="tag_comic"
              label="tag_comic"
              type="text"
              onChange={handleEditTagComic}
              value={dataRowComic.tag_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="author_comic"
              label="author_comic"
              type="text"
              onChange={handleEditAuthorComic}
              value={dataRowComic.author_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="price_comic"
              label="price_comic"
              type="text"
              onChange={handleEditPriceComic}
              value={dataRowComic.price_comic}
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="total_buy"
              label="total_buy"
              type="text"
              fullWidth
              onChange={handleEditTotalBuy}
              value={dataRowComic.total_buy}
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="short_img"
              type="text"
              value={dataRowComic.short_img}
              
              fullWidth
              variant="standard"
              disabled
            />
            <Button
              variant="contained"
               onClick={handleSaveEditComic}
              className={classes.button2}
            >
              Save
            </Button>
            <form
              onSubmit={handleUploadFile}
              encType="multipart/form-data"
              className="formUpload"
            >
              <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="contained-button-file">
                <Button className={classes.button} component="span">
                  Select
                </Button>
              </label>
              <Button className={classes.button} type="submit">
                Upload
              </Button>
            </form>
            <img src={dataRowComic.short_img} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditItem}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* ===========End EditItem================== */}
      </Container>
    </Page>
  );
}
