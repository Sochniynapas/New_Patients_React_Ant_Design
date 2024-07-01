import { Button, Col, Form, Input, Row, Typography } from "antd";
import { formatedDateWithTime } from "../../helpers/formatters";
import Link from "antd/es/typography/Link";
import { useState } from "react";
import { usePostNewCommentMutation, useRedactCommentMutation } from "../../api/inspectionsApi";
import { useGetProfileQuery } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const SingleComment = ({ comment, id }) => {
  const token = localStorage.getItem("token");
  const { Title, Text } = Typography;
  const [addComment, setAddComment] = useState(false);
  const [postNewCom] = usePostNewCommentMutation();
  const { data: profile } = useGetProfileQuery({ token: token });
  const [redactComment] = useRedactCommentMutation();

  const navigate = useNavigate()

  const onAddCommentFinish = async (values) => {
    const data = { content: values.textComment, parentId: comment.id };
    const response = await postNewCom({ data, id: id, token });
    if (response.error) {
      if(response.error.status === 401){
        localStorage.clear()
        navigate("/login")
      }
      setAddComment(false)
    }
    else{
      if(response.data){
        setAddComment(false)
      }
    }
  };

  const onRedactCommentFinish = async (values) => {
    const data = { content: values.redactComment };
    const response = await redactComment({ data, id: comment.id, token });
    if (!response.error) {
      if(response.error.status === 401){
        localStorage.clear()
        navigate("/login")
      }
    }
  };

  const checkForAuthor = () => {
    const userId = profile.id;
    const commentAuthor = comment.author.id || comment.authorId;
    return userId === commentAuthor;
  };

  const handleOpenAddCommentForm = () => {
    setAddComment(!addComment);
  };

  return (
    <Row>
      <Col span={24}>
        <Title style={{ margin: 0 }} level={5}>
          {comment.author.name ? comment.author.name : comment.author}
        </Title>
        {!checkForAuthor() ? (
          <Title style={{ paddingLeft: "10px", margin: 0 }} level={5}>
            {comment.content}
          </Title>
        ) : (
          <Form
            onFinish={onRedactCommentFinish}
            initialValues={{ redactComment: comment.content }}
            name="redactComment"
            style={{ marginTop: 10, width: "100%" }}
          >
            <Row>
              <Form.Item
                style={{ flex: 1, marginRight: 10 }}
                name="redactComment"
                rules={[
                  { required: true, message: "Поле не должно быть пустым" },
                ]}
              >
                <Input />
              </Form.Item>
              <Button className="btn_warning" htmlType="submit">
                Редактировать комментарий
              </Button>
            </Row>
          </Form>
        )}
        <Row>
          <Text type="secondary">{formatedDateWithTime(comment.createTime)}</Text>
          {!comment.parentId && (
            <Link style={{ paddingLeft: "10px" }}>Показать ответы</Link>
          )}
          <Link onClick={handleOpenAddCommentForm} style={{ paddingLeft: "10px" }}>
            Ответить
          </Link>
        </Row>
        {addComment && (
          <Form
            onFinish={onAddCommentFinish}
            name="addComment"
            style={{ marginTop: 10, width: "100%" }}
          >
            <Row>
              <Form.Item
                style={{ flex: 1, marginRight: 10 }}
                name="textComment"
                rules={[
                  { required: true, message: "Поле не должно быть пустым" },
                ]}
              >
                <Input />
              </Form.Item>
              <Button htmlType="submit" type="primary">
                Оставить комментарий
              </Button>
            </Row>
          </Form>
        )}
      </Col>
    </Row>
  );
};

export default SingleComment;
