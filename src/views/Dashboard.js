import React, { useEffect, useState } from "react";
import SignOutButton from "../components/forms/SignOutButton";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import {
  getTasks,
  createTask,
  removeTask,
  updateTask,
} from "../controllers/task.controller";
import FormControl from "@material-ui/core/FormControl";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  signOutButton: {
    position: "absolute",
    display: "flex",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: theme.spacing(4),
  },
  modal: {
    position: "absolute",
    backgroundColor: "white",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vw",
    textAlign: "center",
    alignItems: "center",
    maxWidth: 600,
    margin: theme.spacing(4),
    padding: theme.spacing(4),
  },
  title: { marginBottom: 20 },
  formControl: {
    height: 100,
    padding: 12,
    fontSize: 14,
    width: "70vw",
    maxWidth: 500,
  },
  description: {
    padding: theme.spacing(1),
  },
  task: {
    width: "70vw",
    height: 50,
    padding: 10,
    margin: "10px auto",
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow:
      "0px 5px 20px rgba(31, 47, 71, 0.15),  0px 1px 5px rgba(0, 0, 0, 0.1), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4)",
  },
  subTitle: {
    display: "flex",
    justifyContent: "space-between",
    width: "70vw",
    marginTop: 50,
  },
}));

const Dashboard = ({ userId }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [_item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [doneList, setDoneList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const _data = await getTasks(userId);
      setTaskList(_data.data[0]);
      setDoneList(_data.data[1]);
    }
    fetchData();
    setLoading(false);
  }, [userId, loading]);

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleSubmitCreate = (data) => {
    if (data.target[0].value && data.target[2].value) {
      try {
        const taskInfo = {
          title: data.target[0].value,
          description: data.target[2].value,
          userId: userId,
          done: false,
        };
        createTask(taskInfo).then(() => setLoading(true));
        handleModalClose();
      } catch (e) {
        setError(
          "You can't create new task right now. Please try again later."
        );
      }
    } else {
      setError(
        "You can't create new task right now. Please check if you already typed the title and description"
      );
    }
  };

  const handleSubmitUpdate = (data) => {
    if (data.target[0].value && data.target[2].value) {
      try {
        const updateTaskInfo = {
          ..._item,
          title: data.target[0].value,
          description: data.target[2].value,
          done: false,
        };
        updateTask(updateTaskInfo).then(() => setLoading(true));
      } catch (e) {
        setError(
          "You can't update this task right now. Please try again later."
        );
      }
    } else {
      setError(
        "You can't update this task right now. Please check if you already typed the title and description"
      );
    }
  };

  const MarkAsDone = (item) => {
    const data = {
      ...item,
      done: true,
    };
    try {
      updateTask(data).then(() => setLoading(true));
    } catch (e) {
      setError2(
        "You can't mark this task as 'Done' right now. Please try again later"
      );
    }
  };

  const RemoveTask = (item) => {
    try {
      removeTask(item).then(() => setLoading(true));
    } catch (e) {
      setError2("You can't remove this task right now. Please try again later");
    }
  };

  const TaskModal = ({ item }) => {
    return (
      <Modal open={openModal}>
        <div className={classes.modal}>
          <form
            id="createTask"
            onSubmit={toggle ? handleSubmitUpdate : handleSubmitCreate}
          >
            <div>
              <FormControl className={classes.formControl}>
                <Typography component="h1" variant="h6">
                  Title
                </Typography>
                <TextField
                  id="title"
                  color="primary"
                  placeholder="Please input task title"
                  defaultValue={item?.title}
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
            </div>
            <FormControl className={classes.formControl}>
              <Typography component="h1" variant="h6">
                Description
              </Typography>
              <TextareaAutosize
                aria-label="description"
                placeholder="Please input description"
                defaultValue={item?.description}
                className={classes.description}
                minRows={8}
              />
            </FormControl>
            {error && (
              <Alert
                onClose={() => setError(null)}
                sx={{
                  marginTop: "20px",
                }}
                variant="outlined"
                severity="warning"
              >
                {error}
              </Alert>
            )}
          </form>
          <div className={classes.buttonContainer}>
            <Button
              variant="contained"
              onClick={() => {
                setOpenModal(false);
                setItem(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit" form="createTask">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  return !loading ? (
    <React.Fragment>
      <div className={classes.signOutButton}>
        <SignOutButton />
      </div>
      <Container component="main" maxWidth="xl">
        <div className={classes.paper}>
          <Typography component="h1" variant="h3" className={classes.title}>
            Task Management Application
          </Typography>
          <div className={classes.subTitle}>
            <Typography component="h1" variant="h6">
              Task List
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setOpenModal(true);
                setToggle(false);
              }}
            >
              Create Task
            </Button>
          </div>

          {taskList && taskList.length ? (
            taskList.map((item, id) => (
              <Box className={classes.task} key={id}>
                <Typography>{item.title}</Typography>
                <Grid>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setItem(item);
                      setOpenModal(true);
                      setToggle(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      MarkAsDone(item);
                    }}
                  >
                    Done
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => RemoveTask(item)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Box>
            ))
          ) : (
            <Box className={classes.task}>No Items</Box>
          )}
          <Typography component="h1" variant="h6" className={classes.subTitle}>
            Done
          </Typography>
          {doneList && doneList.length ? (
            doneList.map((item, id) => (
              <Box className={classes.task} key={id}>
                <Typography>{item.title}</Typography>
                <Grid>
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    onClick={() => RemoveTask(item)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Box>
            ))
          ) : (
            <Box className={classes.task}>No Items</Box>
          )}
          {error2 && (
            <Alert
              onClose={() => setError(null)}
              sx={{
                position: "absolute",
                bottom: "30px",
              }}
              variant="outlined"
              severity="warning"
            >
              {error2}
            </Alert>
          )}
        </div>
        <TaskModal item={_item} />
      </Container>
    </React.Fragment>
  ) : (
    <TextField fontSize="lg" sx={{ textAlign: "center" }}>
      Loading
    </TextField>
  );
};

export default Dashboard;
