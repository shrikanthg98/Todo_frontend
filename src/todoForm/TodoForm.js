import { Row, Col, Card, Input, Radio, Button, List, Skeleton, Divider } from "antd";
import { useState, useEffect } from "react";
import { fetchData, addTodo, doUndo, deleteTodo } from "../routes/todoRoutes";
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component';

const toastStyle = {
  position: "top-center",
  autoClose: 2000,
  pauseOnHover: true,
  theme: "dark",
  width: '100px',
}

const TodoForm = () => {
  const [todoData, setTodoData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetchData().then((result) => {
      setTodoData(result);
      setLoading(false);
    })
      .catch(() => {
        setLoading(false);
      });
  };

  const [obj, setObj] = useState({
    desc: '',
    name: '',
    prio: '',
    done: undefined,
  });

  const inputHandler = (val, type) => {
    let temp = { ...obj };
    temp[type] = val;
    setObj({ ...temp });
  }

  const submitHandler = () => {
    const { desc, name, prio, done } = obj;
    if (!desc && !name && !prio && !done) {
      toast.error('Please enter valid inputs!', toastStyle)
      return false
    }
    let payload = {
      todo_description: desc,
      todo_completed: done,
      todo_priority: prio,
      todo_responsible: name,
    }
    addTodo(payload)
      .then(msg => {
        toast.success(msg, toastStyle);
        loadMoreData();
      })
      .catch(err => toast.error(err, toastStyle));
  }

  const doneHandler = (id) => {
    doUndo(id).then(() => loadMoreData());
  }

  const deleteHandler = (id) => {
    deleteTodo(id).then(res => res.acknowledged && toast.success('Todo Deleted', toastStyle));
    loadMoreData();
  }

  useEffect(() => {
    loadMoreData();
  }, [])

  return (<div>
    <Row>
      <Card
        title="Add New Todo"
        style={{
          width: 500,
          backgroundColor: 'black',
          margin: 'auto',
        }}
      >
        <span><h3 style={{ display: 'inline-block', float: 'left' }}>Description : </h3> <Input onChange={(e) => inputHandler(e.target.value, 'desc')} style={{ width: '300px', float: 'right', backgroundColor: 'black' }} /></span><br /><br />
        <span><h3 style={{ display: 'inline-block', float: 'left' }}>Person Name : </h3><Input onChange={(e) => inputHandler(e.target.value, 'name')} style={{ width: '300px', float: 'right', backgroundColor: 'black' }} /></span><br /><br />
        <span><h3 style={{ display: 'inline-block', float: 'left' }}>Priority : </h3>
          <Radio.Group
            style={{ float: 'left', paddingLeft: '87px' }}
            onChange={(e) => inputHandler(e.target.value, 'prio')}
          >
            <Radio value={'Low'}>Low</Radio>
            <Radio value={'Medium'}>Medium</Radio>
            <Radio value={'High'}>High</Radio>
          </Radio.Group>
        </span><br /><br />
        <span><h3 style={{ display: 'inline-block', float: 'left' }}>Completed : </h3>
          <Radio.Group
            style={{ float: 'left', paddingLeft: '60px' }}
            onChange={(e) => inputHandler(e.target.value, 'done')}
          >
            <Radio value={true}>True</Radio>
            <Radio value={false}>False</Radio>
          </Radio.Group>
        </span><br /><br /><br />
        <Button
          onClick={submitHandler}
          style={{
            backgroundColor: 'Black',
            width: '100px'
          }}>
          ADD
        </Button>
      </Card>
    </Row>
    <br />
    <Divider><h2>All Todos</h2></Divider>
    <Row>
      <div
        id="scrollableDiv"
        style={{
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid white',
          width: 500,
          margin: 'auto',
        }}
      >
        <InfiniteScroll
          dataLength={todoData.length}
          next={loadMoreData}
          hasMore={todoData.length < 0}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>It is all, nothing more to load</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={todoData}
            renderItem={(ele) => (
              <List.Item style={{ textAlign: "left" }} key={ele._id}>
                {/* <List.Item.Meta
                  title={ele.todo_responsible}
                  description={ele.todo_description} /> */}
                <Col>
                  <h3>{ele.todo_responsible}</h3>
                  <p style={{ textDecoration: ele.todo_completed ? 'line-through' : 'none' }}>{ele.todo_description}</p>
                </Col>
                <div style={{
                  // padding: '5px',
                  // backgroundColor:
                  //   ele.todo_priority === 'Medium' ?
                  //     'orange' : ele.todo_priority === 'Low' ?
                  //       'green' : 'red'

                }}><p style={{ float: 'right' }}>{ele.todo_priority} Priority</p></div>
                <div>
                  <Button
                    size="medium"
                    style={{ backgroundColor: 'black' }}
                    onClick={() => doneHandler(ele._id)}
                  >{ele.todo_completed ? 'Undo' : 'Done'}</Button>
                  <Button
                    size="medium"
                    style={{ backgroundColor: 'black', marginLeft: '10px' }}
                    onClick={() => deleteHandler(ele._id)}
                  >Delete</Button></div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </Row>
    <br />
  </div>)
}

export default TodoForm;