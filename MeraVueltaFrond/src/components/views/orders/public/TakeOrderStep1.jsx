import * as React from 'react';
import { useReducer, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Col,
  Row,
  Form,
  FormGroup,
  Input,
  Button,
  Badge,
} from 'reactstrap';
import { setOrderStep, setOrderTakeOrder } from '../../../../store/reducer';
import Select from 'react-select';
import { cities, departments } from '../../../lib/cities';
const typesDocument = [
  { value: 'CC', label: 'Cédula de ciudadanía' },
  { value: 'CE', label: 'Cédula de extranjería' },
  { value: 'NIT', label: 'Número de identificación tributaria' },
  { value: 'PAS', label: 'Pasaporte' },
];
const jsonPrefix = [
  {
    value: '57',
    label: 'Colombia +57',
  },
]
const paymentMethods = [
  {
    label: 'Efectivo',
    value: 1,
  },
  {
    label: 'Transferencia Bancaria',
    value: 2,
  },
];

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
}

const TakeOrderStep1 = () => {
  const dispatch = useDispatch();
  const orderByDeliveryNumber = useSelector(
    (state) => state.order.orderByDeliveryNumber
  );
  const [formState, dispatchForm] = useReducer(formReducer, {
    email: orderByDeliveryNumber?.email || '',
    name: orderByDeliveryNumber?.name || '',
    lastName: orderByDeliveryNumber?.lastName || '',
    documentNumber: orderByDeliveryNumber?.documentNumber || '',
    clientPhone: orderByDeliveryNumber?.clientPhone || '',
    deliveryAddress: orderByDeliveryNumber?.deliveryAddress || '',
    neighborhood: orderByDeliveryNumber?.neighborhood || '',
    residentialGroupName: orderByDeliveryNumber?.residentialGroupName || '',
    houseNumberOrApartment: orderByDeliveryNumber?.houseNumberOrApartment || '',
    deliveryNote: orderByDeliveryNumber?.deliveryNote || '',
  });
  const selectedTypeDocument = useMemo(() => {
    return typesDocument.find((type) => type.value === orderByDeliveryNumber?.typeDocument) || {
      value: 'CC',
      label: 'Cédula de ciudadanía',
    };
  }, [orderByDeliveryNumber?.typeDocument, typesDocument]);
  const [typeDocument, setTypeDocument] = useState(selectedTypeDocument);
  const labelDepartment = useMemo(() => {
    let cacheDepartments = departments.find((department) => department.departamento === orderByDeliveryNumber?.department);
    if (cacheDepartments === undefined || Object.keys(cacheDepartments).length === 0) {
      cacheDepartments = departments.find((department) => department.departamento === "Antioquia");
    }
    return {
      value: cacheDepartments?.id,
      label: cacheDepartments?.departamento,
    };
  }, [orderByDeliveryNumber?.department, departments]);
  const [department, setDepartment] = useState(labelDepartment);
  const handleDepartmentChange = useCallback((departmentData) => {
    setDepartment(departmentData);
  }, [setDepartment]);

  const finalCitiesData = useMemo(() => {
    const idDepartment = departments.find((departmentValue) => departmentValue.departamento === department?.label);
    return cities
      .find((city) => city.id === idDepartment?.id)
      ?.ciudades.map((citi, key) => {
        return {
          value: key,
          label: citi
        }
      }) || []
  }, [department, cities, departments]);
  const [city, setCity] = useState(finalCitiesData.find(city => city.label === orderByDeliveryNumber?.city) || null);

  const handleCityChange = useCallback((cityData) => {
    setCity(cityData);
  }, [setCity]);

  const paymentMethodSelected = useMemo(() => {
    return paymentMethods.find((method) => method.label === orderByDeliveryNumber?.paymentMethod) || null;
  }, [orderByDeliveryNumber.paymentMethod, paymentMethods]);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodSelected);
  const handlePayMethodChange = useCallback((paymentData) => {
    setPaymentMethod(paymentData);
  }, [setPaymentMethod]);


  const [prefixClientPhone, setPrefixClientPhone] = useState(jsonPrefix.find((prefix) => prefix.value === orderByDeliveryNumber?.prefix) || {
    value: '57',
    label: 'Colombia +57',
  });
  const handlePrefixChange = useCallback((prefix) => {
    setPrefixClientPhone(prefix);
  }, [setPrefixClientPhone]);

  const handleTypeDocumentChange = useCallback((role) => {
    setTypeDocument(role);
  }, [setTypeDocument]);
  const [formIsValid, setFormIsValid] = React.useState(false);
  React.useEffect(() => {
    if (
      city &&
      typeof city === 'object' &&
      Object.keys(department).length &&
      Object.keys(city).length
    ) {
      setFormIsValid(true);
    }
  }, [
    setFormIsValid,
    formIsValid,
    department,
    city,
  ]);

  const locationTakeOrder = useSelector((state) => state.order.locationTakeOrder);
  const handleSave = useCallback(() => {
    let dataAPI = {
      orderState: 'EsperaDespacho',
    };
    dataAPI.name = formState.name;
    dataAPI.lastName = formState.lastName;
    dataAPI.city = city?.label;
    dataAPI.department = department.label;
    dataAPI.deliveryAddress = formState.deliveryAddress;
    dataAPI.prefix = prefixClientPhone.value;
    dataAPI.clientPhone = formState.clientPhone;
    dataAPI.neighborhood = formState.neighborhood;
    dataAPI.residentialGroupName = formState.residentialGroupName;
    dataAPI.houseNumberOrApartment = formState.houseNumberOrApartment;
    if (formState.email && formState.email != "") {
      dataAPI.email = formState.email;
    }
    if (formState.documentNumber && formState.documentNumber != "") {
      dataAPI.documentNumber = formState.documentNumber;
    }
    if (typeDocument && typeDocument.value != "") {
      dataAPI.typeDocument = typeDocument.value;
    }
    if (paymentMethod && paymentMethod.label != "") {
      dataAPI.paymentMethod = paymentMethod.label;
    }
    if (formState.deliveryNote && formState.deliveryNote != "") {
      dataAPI.deliveryNote = formState.deliveryNote;
    }
    dispatch(
      setOrderTakeOrder(dataAPI)
    );
    dispatch(
      setOrderStep(1)
    );
  }, [formState, typeDocument, department, city, paymentMethod, locationTakeOrder, prefixClientPhone, orderByDeliveryNumber.deliveryNumber]);
  return (
    <>
      <div>
        <Container
          className="themed-container containerProof"
          fluid="sm"
        >
          <Form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Row>
              <Col sm="6">
                <FormGroup >
                  <Input
                    required
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nombres *"
                    value={formState.name}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup >
                  <Input
                    required
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Apellidos *"
                    value={formState.lastName}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'lastName', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col>
                      <Select
                        inputProps={{
                          autoComplete: 'off',
                          id: 'prefix',
                          name: 'prefix',
                        }}
                        onChange={handlePrefixChange}
                        value={prefixClientPhone}
                        required
                        placeholder="Prefijo *"
                        options={jsonPrefix}
                      />
                    </Col>
                    <Col>
                      <Input
                        type="phone"
                        placeholder="Celular *"
                        id="phone"
                        name="phone"
                        required
                        value={formState.clientPhone}
                        onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'clientPhone', value: e.target.value }) }}
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <FormGroup >
                  <Input
                    required
                    type="text"
                    id="deliveryAddress"
                    name='deliveryAddress'
                    placeholder="Dirección Entrega *"
                    value={formState.deliveryAddress}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'deliveryAddress', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup >
                  <Input
                    required
                    type="text"
                    id="residentialGroupName"
                    name='residentialGroupName'
                    placeholder="Barrio *"
                    value={formState.neighborhood}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'neighborhood', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup >
                  <Input
                    required
                    type="text"
                    id="residentialGroupName"
                    name='residentialGroupName'
                    placeholder="Nombre De Conjunto Residencial *"
                    value={formState.residentialGroupName}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'residentialGroupName', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup >
                  <Input
                    required
                    type="text"
                    id="houseOrApartment"
                    name='houseOrApartment'
                    placeholder="Número de Casa, Apto o punto de referencia *"
                    value={formState.houseNumberOrApartment}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'houseNumberOrApartment', value: e.target.value }) }}
                  />
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup >
                  <Select
                    inputProps={{
                      autoComplete: 'off',
                      id: 'department',
                      name: 'department',
                    }}
                    required
                    onChange={handleDepartmentChange}
                    placeholder="Departamento *"
                    defaultValue={labelDepartment}
                    options={departments.map((department) => {
                      return {
                        value: department.id,
                        label: department.departamento,
                      };
                    })}
                  />
                </FormGroup>
                <FormGroup >
                  <Select
                    inputProps={{
                      autoComplete: 'off',
                      id: 'city',
                      name: 'city',
                    }}
                    required
                    onChange={handleCityChange}
                    placeholder="Ciudad *"
                    value={city || ''}
                    options={finalCitiesData}
                  />
                </FormGroup>
                <FormGroup >
                  <Input
                    type="email"
                    id="email"
                    name='email'
                    placeholder="Email"
                    value={formState.email}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup >
                  <Select
                    inputProps={{
                      autoComplete: 'off',
                      id: 'typeDocument',
                      name: 'typeDocument',
                    }}
                    onChange={handleTypeDocumentChange}
                    value={typeDocument}
                    placeholder="Tipo de documento"
                    defaultValue={selectedTypeDocument}
                    options={typesDocument}
                  />
                </FormGroup>
                <FormGroup >
                  <Input
                    type="text"
                    id="documentNumber"
                    name='documentNumber'
                    placeholder="Documento"
                    value={formState.documentNumber}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'documentNumber', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup >
                  <Input
                    type="text"
                    id="deliveryNote"
                    name='deliveryNote'
                    placeholder="Nota De Entrega"
                    value={formState.deliveryNote}
                    onChange={(e) => { dispatchForm({ type: 'UPDATE_FIELD', field: 'deliveryNote', value: e.target.value }) }}
                  />
                </FormGroup>
                <FormGroup >
                  <Select
                    inputProps={{
                      autoComplete: 'off',
                      id: 'paymentMethod',
                      name: 'paymentMethod',
                    }}
                    onChange={handlePayMethodChange}
                    placeholder="Método De Pago"
                    value={paymentMethod || ''}
                    options={paymentMethods}
                  />
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <div className="positionButton">
                    <Button
                      color="success"
                      size="lg"
                      type="submit"
                      disabled={!formIsValid}
                    >
                      Crear Orden
                    </Button>{' '}
                    {``}
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default TakeOrderStep1;
