import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Typography,
} from "antd"
import Input from "antd/es/input/Input"
import {
  useGetSpecialtiesListQuery,
  useRegisterNewUserMutation,
} from "../../api/userApi"
import { useEffect, useState } from "react"
import Password from "antd/es/input/Password"
import { useNavigate } from "react-router-dom"

const RegComponent = () => {
  const { Title } = Typography
  const [searchText, setSearchText] = useState("")
  const { data: specialties } = useGetSpecialtiesListQuery({ name: searchText })
  const [specArray, setSpecArray] = useState([])
  const [userRegister] = useRegisterNewUserMutation()
  const navigate = useNavigate()

  const fillSpecialties = (specialties) => {
    const options = specialties.map((element) => ({
      value: element.id,
      label: element.name,
    }))
    setSpecArray(options)
  }
  const disableFutureDates = (current) => {
    return current && new Date(current) >= new Date()
  }
  const onFinish = async (values) => {
    const formattedDate = values.birthday.toISOString()
    const formattedValues = {
      ...values,
      birthday: formattedDate,
    }
    const response = await userRegister({ body: formattedValues }).unwrap()
    if (response.token) {
      localStorage.setItem("token", response.token)
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo)
  }
  const handleChangeSearch = (value) => {
    setSearchText(value)
  }
  useEffect(() => {
    if(localStorage.getItem("token") !== null){
      navigate("/profile")
    }

    if (specialties) {
      fillSpecialties(specialties.specialties)
    }
  }, [specialties, searchText])

  return (
    <Row justify={"center"} align={"middle"}>
      <Col xl={8} md={12} xs={16}>
        <Card className="form">
          <Title style={{ marginTop: 0 }}>Регистрация</Title>
          <Form
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Имя"
              name="name"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: "Введите имя" }]}
            >
              <Input placeholder="Иванов Иван Иванович" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Пол"
                  name="gender"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "Выберите специальность" },
                  ]}
                >
                  <Select
                    filterOption={false}
                    options={[
                      {
                        value: "Male",
                        label: "Мужской",
                      },
                      {
                        value: "Female",
                        label: "Женский",
                      },
                    ]}
                    placeholder="Выберите пол"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Дата рождения"
                  name="birthday"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  rules={[
                    { required: true, message: "Выберите дату рождения" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    placeholder="Выберите дату рождения"
                    format={"DD/MM/YYYY"}
                    disabledDate={disableFutureDates}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Телефон"
              name="phone"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message:
                    "Введите номер телефона в формате +7 (xxx) xxx xx-xx",
                  pattern: /^\+7 \(\d{3}\) \d{3} \d{2}-\d{2}$/,
                },
              ]}
            >
              <Input placeholder="+7 (xxx) xxx xx-xx" />
            </Form.Item>
            <Form.Item
              label="Специальность"
              name="speciality"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: "Выберите специальность" }]}
            >
              {specArray && (
                <Select
                  showSearch
                  filterOption={false}
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={specArray}
                  placeholder="Выберите специальность"
                  onSearch={(e) => handleChangeSearch(e)}
                />
              )}
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  message: "введите email в формате name@example.com",
                },
              ]}
            >
              <Input placeholder="name@example.com" />
            </Form.Item>
            <Form.Item
              label="Пароль"
              name="password"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  pattern: /^(?=.*\d).{6,}$/,
                  message:
                    "введите пароль, состоящий из 6 символов, минимум одной заглавной буквы и одной цифры",
                },
              ]}
            >
              <Password placeholder="Введите пароль" />
            </Form.Item>
            <Form.Item>
              <Button
                style={{ width: "100%" }}
                type="primary"
                htmlType="submit"
              >
                Зарегистрироваться
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}

export default RegComponent
