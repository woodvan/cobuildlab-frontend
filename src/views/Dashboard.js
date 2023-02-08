import React, { useEffect, useState } from "react";
import SignOutButton from "../components/forms/SignOutButton";
import styled from "styled-components";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  getTasks,
  createTask,
  removeTask,
  updateTask,
} from "../controllers/task.controller";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Dashboard = ({ userId }) => {
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
        <Box sx={{ ...style, width: "60vw", maxWidth: "800px" }}>
          <form
            id="createTask"
            onSubmit={toggle ? handleSubmitUpdate : handleSubmitCreate}
          >
            <Box
              sx={{
                margin: 2,
                maxWidth: "800px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FormControl sx={{ marginBottom: 4 }}>
                <p>Title</p>
                <TextField
                  id="title"
                  color="primary"
                  placeholder="Please input task title"
                  defaultValue={item?.title}
                />
              </FormControl>
              <FormControl>
                <p>Description</p>
                <TextareaAutosize
                  aria-label="description"
                  placeholder="Please input description"
                  defaultValue={item?.description}
                  style={{ height: 100, padding: 12, fontSize: 14 }}
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
            </Box>
          </form>
          <ButtonContainer>
            <Button variant="contained" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button variant="contained" type="submit" form="createTask">
              Save
            </Button>
          </ButtonContainer>
        </Box>
      </Modal>
    );
  };

  return !loading ? (
    <React.Fragment>
      <SignOutButtonContainer>
        <SignOutButton />
      </SignOutButtonContainer>
      <Title style={{ marginBottom: "60px" }}>
        Task Management Application
      </Title>
      <Title
        style={{ fontSize: "20px", textAlign: "left", position: "relative" }}
      >
        Task List
        <Button
          variant="contained"
          style={{
            position: "absolute",
            width: "160px",
            right: 0,
          }}
          onClick={() => {
            setOpenModal(true);
            setToggle(false);
          }}
        >
          Create Task
        </Button>
      </Title>

      {taskList && taskList.length ? (
        taskList.map((item, id) => (
          <Task key={id}>
            <TaskTitle>{item.title}</TaskTitle>
            <Stack direction="row" spacing={2} height={28}>
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
                color="success"
                onClick={() => {
                  MarkAsDone(item);
                }}
              >
                Done
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => RemoveTask(item)}
              >
                Remove
              </Button>
            </Stack>
          </Task>
        ))
      ) : (
        <Task>No Items</Task>
      )}
      <Title
        style={{
          fontSize: "20px",
          textAlign: "left",
          marginTop: "60px",
        }}
      >
        Done
      </Title>
      {doneList && doneList.length ? (
        doneList.map((item, id) => (
          <Task key={id}>
            <TaskTitle>{item.title}</TaskTitle>
            <Stack direction="row" spacing={2} height={40} mt={1}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => RemoveTask(item)}
              >
                Remove
              </Button>
            </Stack>
          </Task>
        ))
      ) : (
        <Task>No Items</Task>
      )}
      <TaskModal item={_item} />
      {error2 && (
        <Alert
          onClose={() => setError(null)}
          sx={{
            width: "400px",
            position: "absolute",
            bottom: "30px",
          }}
          variant="outlined"
          severity="warning"
        >
          {error2}
        </Alert>
      )}
    </React.Fragment>
  ) : (
    <TextField fontSize="lg" sx={{ textAlign: "center" }}>
      Loading
    </TextField>
  );
};

const SignOutButtonContainer = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  right: 10px;
`;

const Title = styled.h1`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 40px;
  line-height: 48px;
  color: #000;
  text-align: center;
  width: 70vw;
`;

const Task = styled.div`
  width: 70vw;
  height: 60px;
  padding: 0 10px;
  font-weight: 400;
  margin: 10px auto;
  // border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 5px 20px rgba(31, 47, 71, 0.15),
    0px 1px 5px rgba(0, 0, 0, 0.1), inset 0 0 0 0.5px rgba(255, 255, 255, 0.4);
`;

const TaskTitle = styled.p`
  margin-left: 10px;
  font-size: 20px;
  font-weight: 400;
  border-radius: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
`;

export default Dashboard;
