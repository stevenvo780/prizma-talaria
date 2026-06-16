import * as React from 'react';
import { useReducer, useMemo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Select } from 'prizma-ui';
import { setOrderStep, setOrderTakeOrder } from '../../../../store/reducer';
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
];
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
};

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
    return (
      typesDocument.find((type) => type.value === orderByDeliveryNumber?.typeDocument)?.value ||
      'CC'
    );
  }, [orderByDeliveryNumber?.typeDocument]);
  const [typeDocument, setTypeDocument] = useState(selectedTypeDocument);

  const initialDepartment = useMemo(() => {
    let dep = departments.find(
      (d) => d.departamento === orderByDeliveryNumber?.department
    );
    if (!dep) {
      dep = departments.find((d) => d.departamento === 'Antioquia');
    }
    return dep?.id?.toString() || '';
  }, [orderByDeliveryNumber?.department]);
  const [department, setDepartment] = useState(initialDepartment);

  const handleDepartmentChange = useCallback((e) => {
    setDepartment(e.target.value);
    setCity('');
  }, []);

  const finalCitiesData = useMemo(() => {
    const depObj = departments.find((d) => d.id?.toString() === department);
    return (
      cities
        .find((c) => c.id === depObj?.id)
        ?.ciudades.map((citi) => ({ value: citi, label: citi })) || []
    );
  }, [department]);

  const initialCity = useMemo(() => {
    return orderByDeliveryNumber?.city || '';
  }, [orderByDeliveryNumber?.city]);
  const [city, setCity] = useState(initialCity);

  const handleCityChange = useCallback((e) => {
    setCity(e.target.value);
  }, []);

  const initialPaymentMethod = useMemo(() => {
    return (
      paymentMethods.find((m) => m.label === orderByDeliveryNumber?.paymentMethod)?.label || ''
    );
  }, [orderByDeliveryNumber?.paymentMethod]);
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);

  const handlePayMethodChange = useCallback((e) => {
    setPaymentMethod(e.target.value);
  }, []);

  const [prefixClientPhone, setPrefixClientPhone] = useState(
    jsonPrefix.find((p) => p.value === orderByDeliveryNumber?.prefix)?.value || '57'
  );
  const handlePrefixChange = useCallback((e) => {
    setPrefixClientPhone(e.target.value);
  }, []);

  const handleTypeDocumentChange = useCallback((e) => {
    setTypeDocument(e.target.value);
  }, []);

  const [formIsValid, setFormIsValid] = React.useState(false);
  React.useEffect(() => {
    if (city && department) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [department, city]);

  const locationTakeOrder = useSelector((state) => state.order.locationTakeOrder);

  const handleSave = useCallback(() => {
    const selectedDep = departments.find((d) => d.id?.toString() === department);
    let dataAPI = {
      orderState: 'EsperaDespacho',
    };
    dataAPI.name = formState.name;
    dataAPI.lastName = formState.lastName;
    dataAPI.city = city;
    dataAPI.department = selectedDep?.departamento || department;
    dataAPI.deliveryAddress = formState.deliveryAddress;
    dataAPI.prefix = prefixClientPhone;
    dataAPI.clientPhone = formState.clientPhone;
    dataAPI.neighborhood = formState.neighborhood;
    dataAPI.residentialGroupName = formState.residentialGroupName;
    dataAPI.houseNumberOrApartment = formState.houseNumberOrApartment;
    if (formState.email && formState.email !== '') {
      dataAPI.email = formState.email;
    }
    if (formState.documentNumber && formState.documentNumber !== '') {
      dataAPI.documentNumber = formState.documentNumber;
    }
    if (typeDocument && typeDocument !== '') {
      dataAPI.typeDocument = typeDocument;
    }
    if (paymentMethod && paymentMethod !== '') {
      dataAPI.paymentMethod = paymentMethod;
    }
    if (formState.deliveryNote && formState.deliveryNote !== '') {
      dataAPI.deliveryNote = formState.deliveryNote;
    }
    dispatch(setOrderTakeOrder(dataAPI));
    dispatch(setOrderStep(1));
  }, [formState, typeDocument, department, city, paymentMethod, locationTakeOrder, prefixClientPhone, orderByDeliveryNumber?.deliveryNumber]);

  return (
    <>
      <div>
        <div className="themed-container containerProof">
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Input
                  required
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Nombres *"
                  value={formState.name}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'name', value: e.target.value });
                  }}
                />
                <Input
                  required
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Apellidos *"
                  value={formState.lastName}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'lastName', value: e.target.value });
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Select
                    id="prefix"
                    name="prefix"
                    required
                    value={prefixClientPhone}
                    onChange={handlePrefixChange}
                    style={{ flex: '0 0 auto' }}
                  >
                    {jsonPrefix.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </Select>
                  <Input
                    type="phone"
                    placeholder="Celular *"
                    id="phone"
                    name="phone"
                    required
                    value={formState.clientPhone}
                    onChange={(e) => {
                      dispatchForm({ type: 'UPDATE_FIELD', field: 'clientPhone', value: e.target.value });
                    }}
                  />
                </div>
                <Input
                  required
                  type="text"
                  id="deliveryAddress"
                  name="deliveryAddress"
                  placeholder="Dirección Entrega *"
                  value={formState.deliveryAddress}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'deliveryAddress', value: e.target.value });
                  }}
                />
                <Input
                  required
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  placeholder="Barrio *"
                  value={formState.neighborhood}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'neighborhood', value: e.target.value });
                  }}
                />
                <Input
                  required
                  type="text"
                  id="residentialGroupName"
                  name="residentialGroupName"
                  placeholder="Nombre De Conjunto Residencial *"
                  value={formState.residentialGroupName}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'residentialGroupName', value: e.target.value });
                  }}
                />
                <Input
                  required
                  type="text"
                  id="houseOrApartment"
                  name="houseOrApartment"
                  placeholder="Número de Casa, Apto o punto de referencia *"
                  value={formState.houseNumberOrApartment}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'houseNumberOrApartment', value: e.target.value });
                  }}
                />
              </div>
              <div style={{ flex: '1 1 45%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Select
                  id="department"
                  name="department"
                  required
                  value={department}
                  onChange={handleDepartmentChange}
                >
                  <option value="">Departamento *</option>
                  {departments.map((dep) => (
                    <option key={dep.id} value={dep.id?.toString()}>
                      {dep.departamento}
                    </option>
                  ))}
                </Select>
                <Select
                  id="city"
                  name="city"
                  required
                  value={city}
                  onChange={handleCityChange}
                >
                  <option value="">Ciudad *</option>
                  {finalCitiesData.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'email', value: e.target.value });
                  }}
                />
                <Select
                  id="typeDocument"
                  name="typeDocument"
                  value={typeDocument}
                  onChange={handleTypeDocumentChange}
                >
                  <option value="">Tipo de documento</option>
                  {typesDocument.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
                <Input
                  type="text"
                  id="documentNumber"
                  name="documentNumber"
                  placeholder="Documento"
                  value={formState.documentNumber}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'documentNumber', value: e.target.value });
                  }}
                />
                <Input
                  type="text"
                  id="deliveryNote"
                  name="deliveryNote"
                  placeholder="Nota De Entrega"
                  value={formState.deliveryNote}
                  onChange={(e) => {
                    dispatchForm({ type: 'UPDATE_FIELD', field: 'deliveryNote', value: e.target.value });
                  }}
                />
                <Select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handlePayMethodChange}
                >
                  <option value="">Método De Pago</option>
                  {paymentMethods.map((m) => (
                    <option key={m.value} value={m.label}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div style={{ width: '100%' }}>
                <div className="positionButton">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={!formIsValid}
                  >
                    Crear Orden
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TakeOrderStep1;
