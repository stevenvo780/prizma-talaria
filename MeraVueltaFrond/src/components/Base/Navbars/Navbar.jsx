import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import { logoutAction, searchAllOrdersAction, setTourRun } from '../../../store/reducer';
import { BsTruck } from 'react-icons/bs';
import { MdCorporateFare } from 'react-icons/md';
import {
  Topbar,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
} from 'prizma-ui';


function Header(props) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOptionsOpen, setDropdownOptionsOpen] = React.useState(false);
  const [color, setColor] = React.useState('transparent');
  const sidebarToggle = React.useRef();
  const [movil, setMovil] = React.useState(false);

  const getSearchStyles = () => {
    if (movil) {
      return {
        position: 'relative',
        marginTop: -10,
        height: 40,
        background:
          'url(https://icons.iconarchive.com/icons/bootstrap/bootstrap/256/Bootstrap-search-icon.png) no-repeat scroll 7px 7px',
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
        background:
          'url(https://icons.iconarchive.com/icons/bootstrap/bootstrap/256/Bootstrap-search-icon.png) no-repeat scroll 7px 7px',
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

  const logout = (e) => {
    dispatch(logoutAction());
    dispatch(push('/login'));
  };

  const getBrand = () => {
    let brandName = 'Talaria';
    props.routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
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
    if (target.key === 'Enter') {
      dispatch(
        searchAllOrdersAction({
          word: searchTerm,
          take: 50,
          skip: 0,
        }),
      );
    }
  };

  const isFullScreenMap =
    props.location.pathname.indexOf('full-screen-maps') !== -1;
  const navColor = isFullScreenMap ? 'dark' : color;
  const navClassName = isFullScreenMap
    ? 'navbar-absolute fixed-top'
    : `navbar-absolute fixed-top ${color === 'transparent' ? 'navbar-transparent ' : ''}`;

  const triggerLabel = movil ? (
    <>
      <i className="nc-icon nc-settings-gear-65" /> Cuenta
    </>
  ) : user.role === 'company' ? (
    <Bubble name={user.companyName.slice(0, 20)} />
  ) : (
    <Bubble name={user.name + ' ' + user.lastName} />
  );

  return (
    <Topbar
      data-color={navColor}
      className={navClassName}
      style={{ paddingTop: 0, paddingBottom: 0 }}
    >
      <div className="container-fluid">
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
          <span className="navbar-brand">{getBrand()}</span>
        </div>

        <button
          type="button"
          className="navbar-toggler"
          style={{ backgroundImage: 'none' }}
          onClick={toggle}
        >
          {user.role === 'company' && (
            <Bubble name={user.companyName.slice(0, 20)} />
          )}
          {user.role === 'domiciliary' && (
            <Bubble name={user.name + ' ' + user.lastName} />
          )}
        </button>

        <div
          className={`collapse navbar-collapse justify-content-end${isOpen ? ' show' : ''}`}
        >
          <nav className="navbar-nav">
            {user.role === 'company' && (
              <form style={{ marginTop: '18px' }} onSubmit={handleSubmit}>
                <Input
                  type="text"
                  id="buscar"
                  placeholder="Buscar"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  onKeyDown={handleKeyPress}
                  onClick={(e) => {
                    if (e.nativeEvent.offsetX <= 40) {
                      e.preventDefault();
                      setSearchTerm(event.target.value);
                    }
                  }}
                  value={searchTerm}
                  style={getSearchStyles()}
                />
              </form>
            )}
            {user.role === 'company' && (
              <button
                type="button"
                id="tour-help-btn"
                className="nav-link btn btn-link"
                aria-label="Ver tutorial"
                title="Ver tutorial"
                style={{ fontSize: '20px', padding: '0 8px', marginTop: '10px', opacity: 0.85 }}
                onClick={() => dispatch(setTourRun(true))}
              >
                &#63;
              </button>
            )}

            <DropdownMenu
              open={dropdownOptionsOpen}
              onOpenChange={setDropdownOptionsOpen}
              align="end"
              trigger={
                <button type="button" className="nav-link btn btn-link">
                  {triggerLabel}
                </button>
              }
            >
              <div style={{ padding: '8px 16px' }}>
                {user.role === 'company' && (
                  <p
                    style={{
                      fontSize: '15px',
                      margin: 0,
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    }}
                  >
                    <MdCorporateFare /> {user.companyName.slice(0, 20)}
                  </p>
                )}
                {user.role === 'domiciliary' && (
                  <p
                    style={{
                      fontSize: '15px',
                      margin: 0,
                      paddingLeft: '10px',
                      paddingRight: '10px',
                    }}
                  >
                    <BsTruck /> {user.name + ' ' + user.lastName}
                  </p>
                )}
              </div>
              <DropdownSeparator />
              <DropdownItem onSelect={logout}>Cerrar sesión</DropdownItem>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </Topbar>
  );
}

const Bubble = ({ name }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((namePart) => namePart.charAt(0))
    .join('');
  return <div className="bubble">{initials.toUpperCase()}</div>;
};


export default Header;
