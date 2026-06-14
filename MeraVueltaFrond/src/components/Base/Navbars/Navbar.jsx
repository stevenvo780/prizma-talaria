import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Input
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { logoutAction, searchAllOrdersAction } from '../../../store/reducer';
import { BsTruck, BsSearch } from 'react-icons/bs';
import { MdCorporateFare } from 'react-icons/md';


function Header(props) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownNotificationOpen, setDropdownNotificationOpen] =
    React.useState(false);
  const [dropdownOptionsOpen, setDropdownOptionsOpen] =
    React.useState(false);
  const [color, setColor] = React.useState('transparent');
  const sidebarToggle = React.useRef();
  const [movil, setMovil] = React.useState(false);
  const getSearchStyles = () => {
    if (movil) {
      return {
        position: 'relative',
        marginTop: -10,
        height: 40,
        background: 'url(https://icons.iconarchive.com/icons/bootstrap/bootstrap/256/Bootstrap-search-icon.png) no-repeat scroll 7px 7px',
        backgroundSize: '24px 24px',
        paddingLeft: '40px',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '5px',
      };
    } else {
      return {
        position: 'relative',
        marginTop: -10,
        height: 40,
        background: 'url(https://icons.iconarchive.com/icons/bootstrap/bootstrap/256/Bootstrap-search-icon.png) no-repeat scroll 7px 7px',
        backgroundSize: '24px 24px',
        paddingLeft: '40px',
        borderRadius: '5px',
      };
    }
  };
  const location = useLocation();
  const toggle = () => {
    if (isOpen) {
      setColor('transparent');
    } else {
      setColor('dark');
    }
    setIsOpen(!isOpen);
  };
  const dropdownNotificationToggle = (e) => {
    setDropdownNotificationOpen(!dropdownNotificationOpen);
  };
  const dropdownOptionsToggle = (e) => {
    setDropdownOptionsOpen(!dropdownOptionsOpen);
  };
  const logout = (e) => {
    e.preventDefault();
    dispatch(logoutAction());
    dispatch(push('/login'));
  };
  const getBrand = () => {
    let brandName = 'Mera Vuelta';
    props.routes.map((prop, key) => {
      if (
        window.location.href.indexOf(prop.layout + prop.path) !== -1
      ) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  };
  const openSidebar = () => {
    document.documentElement.classList.toggle('nav-open');
    sidebarToggle.current.classList.toggle('toggled');
  };
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  const updateColor = () => {
    if (window.innerWidth < 993 && isOpen) {
      setColor('dark');
    } else {
      setColor('transparent');
    }
  };
  React.useEffect(() => {
    window.addEventListener('resize', updateColor.bind(this));
  });
  React.useEffect(() => {
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf('nav-open') !== -1
    ) {
      document.documentElement.classList.toggle('nav-open');
      sidebarToggle.current.classList.toggle('toggled');
    }
    if (window.innerWidth < 993) {
      setMovil(true);
    }
  }, [location]);
  const user = useSelector((state) => state.login.user);
  const [searchTerm, setSearchTerm] = React.useState('');
  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(
      searchAllOrdersAction({
        word: searchTerm,
        take: 50,
        skip: 0,
      }),
    );
  };
  const handleKeyPress = (target) => {
    if (target.charCode == 13) {
      dispatch(
        searchAllOrdersAction({
          word: searchTerm,
          take: 50,
          skip: 0,
        }),
      );
    }
  };
  return (
    <Navbar
      color={
        props.location.pathname.indexOf('full-screen-maps') !== -1
          ? 'dark'
          : color
      }
      expand="lg"
      className={
        props.location.pathname.indexOf('full-screen-maps') !== -1
          ? 'navbar-absolute fixed-top'
          : `navbar-absolute fixed-top ${color === 'transparent' ? 'navbar-transparent ' : ''
          }`
      }
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <Container fluid>
        <div className="navbar-wrapper">
          <div className="navbar-toggle">
            <button
              type="button"
              ref={sidebarToggle}
              className="navbar-toggler"
              onClick={() => openSidebar()}
            >
              <span className="navbar-toggler-bar bar1" />
              <span className="navbar-toggler-bar bar2" />
              <span className="navbar-toggler-bar bar3" />
            </button>
          </div>
          <NavbarBrand>{getBrand()}</NavbarBrand>
        </div>
        <NavbarToggler style={{ backgroundImage: 'none' }} onClick={toggle}>
          {user.role === "company" && (
            <Bubble name={user.companyName.slice(0, 20)} />
          )}
          {user.role === "domiciliary" && (
            <Bubble name={user.name + " " + user.lastName} />
          )}
        </NavbarToggler>
        <Collapse
          isOpen={isOpen}
          navbar
          className="justify-content-end"
        >
          <Nav navbar>
            {user.role === "company" && (
              <form style={{ marginTop: "18px" }} onSubmit={handleSubmit}>
                <Input
                  type="text"
                  id="buscar"
                  placeholder="Buscar"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyPress={handleKeyPress}
                  onClick={(e) => {
                    if (e.nativeEvent.offsetX <= 40) {
                      e.preventDefault();
                      setSearchTerm(event.target.value)
                    }
                  }}
                  value={searchTerm}
                  style={getSearchStyles()}
                />
              </form>
            )}
            <Dropdown
              nav
              isOpen={dropdownOptionsOpen}
              toggle={(e) => dropdownOptionsToggle(e)}
            >
              <DropdownToggle nav>
                {!movil ?
                  <>
                    {user.role === "company" && (
                      <Bubble name={user.companyName.slice(0, 20)} />
                    )}
                    {user.role === "domiciliary" && (
                      <Bubble name={user.name + " " + user.lastName} />
                    )}
                  </> :
                  <>
                    <i className="nc-icon nc-settings-gear-65" /> Cuenta
                  </>
                }
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header>
                  {user.role === "company" && (
                    <p style={{ fontSize: "15px", position: "relative", top: "1vh", right: "1.5vh", paddingLeft: "10px", paddingRight: "10px" }}><MdCorporateFare />  {user.companyName.slice(0, 20)}</p>
                  )}
                  {user.role === "domiciliary" && (
                    <p style={{ fontSize: "15px", position: "relative", top: "1vh", right: "1.5vh", paddingLeft: "10px", paddingRight: "10px" }}><BsTruck />  {user.name + " " + user.lastName}</p>
                  )}
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={logout} tag="a">
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Collapse>
      </Container>
    </Navbar >
  );
}

const Bubble = ({ name }) => {
  const initials = name.split(' ').slice(0, 2).map(namePart => namePart.charAt(0)).join('');
  return (
    <div className='bubble'>
      {initials.toUpperCase()}
    </div>
  );
};


export default Header;
