import { Card, Col, Row, Tree, Typography } from "antd"
import SingleComment from "./SingleComment"
import { useGetConsultationDetailsQuery } from "../../api/inspectionsApi"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const SingleConsult = ({ details }) => {
  const token = localStorage.getItem("token")
  const { Title, Text } = Typography
  const { data: consData, error: consError } = useGetConsultationDetailsQuery({
    id: details.id,
    token: token,
  })
  const [treeData, setTreeData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (consError && consError.status === 401) {
      localStorage.clear()
      navigate("/login")
    } else {
      if (consData) {
        const commentsById = {}
        consData.comments.forEach((comment) => {
          commentsById[comment.id] = { ...comment, children: [] }
        })
        const rootComments = [];
        consData.comments.forEach((comment) => {
          if (comment.parentId === null) {
            rootComments.push(commentsById[comment.id])
          } else if (commentsById[comment.parentId]) {
            commentsById[comment.parentId].children.push(commentsById[comment.id])
          }
        })

        const buildTreeData = (comments) => {
          return comments.map((comment) => ({
            title: <SingleComment comment={comment} id={details.id} />,
            key: `comment-${comment.id}`,
            children: buildTreeData(comment.children),
          }))
        }

        setTreeData(buildTreeData(rootComments))
      }
    }
  }, [consData, consError])

  return (
    <Row>
      <Col span={24}>
        <Card style={{ marginTop: "20px" }} className="form">
          <Title style={{ marginTop: 0 }} level={2}>
            Консультация
          </Title>
          <Title level={5}>Консультант: {details.rootComment.name}</Title>
          <Text type="secondary">
            Специализация консультанта: {details.speciality.name}
          </Text>
          {details.rootComment.content !== "комментарий" && (
            <Col span={24}>
              <Title level={5}>Комментарии</Title>
              {consData && (
                <Tree
                  showLine={true}
                  style={{ backgroundColor: "#F7F6FC", width: "100%" }}
                  treeData={treeData}
                />
              )}
            </Col>
          )}
        </Card>
      </Col>
    </Row>
  )
}

export default SingleConsult
