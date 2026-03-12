import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import api from './api/client';

const money = (n) =>
  new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    maximumFractionDigits: 0,
  }).format(n || 0);

function getStyles(theme) {
  const isDark = theme === 'dark';

  const colors = isDark
    ? {
        appBg: '#1E1714',
        pageBg: '#241C19',
        panel: '#332824',
        panelSoft: '#3B2F2A',
        text: '#F7EBDD',
        muted: '#D8C4B2',
        border: '#4A3A33',
        primary: '#E05A3F',
        primaryHover: '#F06B50',
        secondaryBg: '#2A211D',
        secondaryText: '#F7EBDD',
        inputBg: '#2A211D',
        successBg: '#1F3B2B',
        successText: '#CFF5DB',
        dangerBg: '#4A2323',
        dangerBorder: '#7A3A3A',
        tableHead: '#2B221F',
        headerBg: '#A93522',
        ticketBg: '#2A211D',
      }
    : {
        appBg: '#F5EEE6',
        pageBg: '#FFF8F1',
        panel: '#FFFDF9',
        panelSoft: '#FFF6EC',
        text: '#3B2113',
        muted: '#6B4A3A',
        border: '#E8DCCE',
        primary: '#D94A2F',
        primaryHover: '#BE3E26',
        secondaryBg: '#FFF8F1',
        secondaryText: '#3B2113',
        inputBg: '#FFFFFF',
        successBg: '#ECFDF5',
        successText: '#166534',
        dangerBg: '#FFF1F2',
        dangerBorder: '#F4C7CC',
        tableHead: '#F8EFE5',
        headerBg: '#D94A2F',
        ticketBg: '#FFFDF9',
      };

  return {
    app: {
      minHeight: '100vh',
      background: colors.appBg,
      fontFamily: 'Arial, sans-serif',
      color: colors.text,
    },
    header: {
      background: colors.headerBg,
      color: 'white',
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap',
      boxShadow: '0 10px 24px rgba(0,0,0,0.10)',
    },
    brand: {
      fontSize: 22,
      fontWeight: 800,
    },
    headerSub: {
      color: 'rgba(255,255,255,0.88)',
      marginTop: 4,
    },
    headerActions: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
    },
    loginPage: {
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 20,
      background: colors.appBg,
    },
    loginCard: {
      width: '100%',
      maxWidth: 420,
      background: colors.panel,
      borderRadius: 22,
      padding: 24,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 14px 36px rgba(0,0,0,0.10)',
    },
    mobileTabs: {
      display: 'none',
      gap: 8,
      padding: '14px 20px 0 20px',
      flexWrap: 'wrap',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1.15fr 1fr',
      gap: 20,
      padding: 20,
    },
    reportGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 20,
    },
    panel: {
      background: colors.panel,
      borderRadius: 22,
      padding: 18,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 10px 28px rgba(0,0,0,0.07)',
    },
    orderIntro: {
      display: 'grid',
      gap: 12,
      marginBottom: 18,
    },
    orderBadge: {
      display: 'inline-block',
      background: colors.primary,
      color: 'white',
      padding: '10px 14px',
      borderRadius: 14,
      fontSize: 20,
      fontWeight: 800,
    },
    sectionTitle: {
      marginTop: 0,
      marginBottom: 16,
    },
    categoryRow: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
      gap: 12,
    },
    productCard: {
      textAlign: 'left',
      border: `1px solid ${colors.border}`,
      background: colors.panelSoft,
      borderRadius: 18,
      padding: 16,
      cursor: 'pointer',
      minHeight: 120,
      color: colors.text,
    },
    productName: {
      fontSize: 16,
      fontWeight: 700,
    },
    comboText: {
      fontSize: 12,
      marginTop: 6,
      color: colors.muted,
    },
    productPrice: {
      marginTop: 10,
      fontWeight: 800,
    },
    orderHeader: {
      marginBottom: 14,
    },
    orderBig: {
      fontSize: 28,
      fontWeight: 800,
      lineHeight: 1.1,
    },
    customerPill: {
      marginTop: 8,
      display: 'inline-block',
      background: colors.panelSoft,
      color: colors.text,
      padding: '8px 12px',
      borderRadius: 999,
      fontSize: 14,
      fontWeight: 600,
      border: `1px solid ${colors.border}`,
    },
    itemsList: {
      display: 'grid',
      gap: 10,
      marginBottom: 16,
    },
    itemCard: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      border: `1px solid ${colors.border}`,
      borderRadius: 16,
      padding: 12,
      background: colors.panelSoft,
    },
    itemName: {
      fontWeight: 700,
    },
    itemMeta: {
      fontSize: 13,
      color: colors.muted,
      marginTop: 4,
    },
    qtyActions: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    qtyNumber: {
      minWidth: 18,
      textAlign: 'center',
      fontWeight: 700,
    },
    summaryBox: {
      borderTop: `1px solid ${colors.border}`,
      paddingTop: 12,
      marginTop: 12,
      display: 'grid',
      gap: 8,
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
    },
    quickActions: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 10,
    },
    paymentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },
    label: {
      display: 'block',
      marginBottom: 6,
      fontSize: 14,
      color: colors.muted,
    },
    input: {
      width: '100%',
      padding: 12,
      borderRadius: 14,
      border: `1px solid ${colors.border}`,
      boxSizing: 'border-box',
      fontSize: 16,
      background: colors.inputBg,
      color: colors.text,
    },
    primaryButton: {
      border: 0,
      background: colors.primary,
      color: 'white',
      padding: '10px 14px',
      borderRadius: 12,
      fontWeight: 700,
      cursor: 'pointer',
    },
    secondaryButton: {
      border: `1px solid ${colors.border}`,
      background: colors.secondaryBg,
      color: colors.secondaryText,
      padding: '10px 14px',
      borderRadius: 12,
      fontWeight: 600,
      cursor: 'pointer',
    },
    primaryLargeButton: {
      width: '100%',
      border: 0,
      background: colors.primary,
      color: 'white',
      padding: '16px',
      borderRadius: 16,
      fontWeight: 800,
      fontSize: 16,
      cursor: 'pointer',
      marginTop: 8,
    },
    disabledLargeButton: {
      width: '100%',
      border: 0,
      background: '#BFAFA4',
      color: '#6B4A3A',
      padding: '16px',
      borderRadius: 16,
      fontWeight: 800,
      fontSize: 16,
      cursor: 'not-allowed',
      marginTop: 8,
    },
    miniButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      border: `1px solid ${colors.border}`,
      background: colors.secondaryBg,
      fontSize: 18,
      cursor: 'pointer',
      color: colors.text,
    },
    deleteButton: {
      width: 40,
      height: 36,
      borderRadius: 10,
      border: `1px solid ${colors.dangerBorder}`,
      background: colors.dangerBg,
      cursor: 'pointer',
      color: colors.text,
    },
    successBox: {
      background: colors.successBg,
      color: colors.successText,
      padding: 12,
      borderRadius: 12,
      fontWeight: 700,
      marginTop: 8,
    },
    reportSection: {
      padding: 20,
    },
    tableWrap: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      background: colors.panel,
      borderRadius: 12,
      overflow: 'hidden',
    },
    muted: {
      color: colors.muted,
    },
    emptyState: {
      padding: 20,
      border: `1px dashed ${colors.border}`,
      borderRadius: 12,
      textAlign: 'center',
      color: colors.muted,
      background: colors.panelSoft,
    },
    mobileHidden: {},
    ticketPage: {
      padding: 20,
      display: 'flex',
      justifyContent: 'center',
    },
    ticketCard: {
      width: '100%',
      maxWidth: 520,
      background: colors.ticketBg,
      borderRadius: 22,
      padding: 24,
      border: `1px solid ${colors.border}`,
      boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
    },
    ticketBlock: {
      borderBottom: `1px dashed ${colors.border}`,
      paddingBottom: 12,
      marginBottom: 16,
    },
    ticketTitle: {
      fontSize: 24,
      fontWeight: 800,
      marginBottom: 8,
    },
    ticketMeta: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 4,
    },
    ticketItems: {
      display: 'grid',
      gap: 12,
      marginBottom: 16,
    },
    ticketRow: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      alignItems: 'flex-start',
      borderBottom: `1px solid ${colors.border}`,
      paddingBottom: 10,
    },
    ticketTotals: {
      borderTop: `1px solid ${colors.border}`,
      paddingTop: 12,
      marginTop: 12,
      display: 'grid',
      gap: 8,
    },
    ticketActions: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap',
      marginTop: 20,
    },
    productsPage: {
      padding: 20,
    },
    productsLayout: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 20,
    },
    formGrid: {
      display: 'grid',
      gap: 12,
    },
    checkboxRow: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginTop: 4,
    },
    productsActions: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 16,
    },
  };
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('instante_theme') || 'light');
  const styles = getStyles(theme);

  const [token, setToken] = useState(localStorage.getItem('instante_token'));
  const [user, setUser] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [screen, setScreen] = useState('pos');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [mobileTab, setMobileTab] = useState('productos');
  const [ordersReport, setOrdersReport] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(createEmptyOrder());
  const [lastTicket, setLastTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    id: null,
    nombre: '',
    categoria: '',
    precio: '',
    tipo: 'simple',
    activo: true,
  });

  useEffect(() => {
    localStorage.setItem('instante_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!token) return;
    loadBootstrap();
  }, [token]);

  async function loadBootstrap() {
    try {
      const [{ data: me }, { data: products }] = await Promise.all([
        api.get('/auth/me'),
        api.get('/products'),
      ]);
      setUser(me);
      setCatalog(products);
      await loadReports();
    } catch (error) {
      console.error(error);
      localStorage.removeItem('instante_token');
      setToken(null);
      setUser(null);
    }
  }

  async function loadReports() {
    const [{ data: orders }, { data: top }] = await Promise.all([
      api.get('/reports/orders'),
      api.get('/reports/top-products'),
    ]);
    setOrdersReport(orders);
    setTopProducts(top);
  }

  function createEmptyOrder(nextNumber = 1) {
    return {
      localNumber: nextNumber,
      customerLabel: '',
      sentToKitchen: false,
      dbId: null,
      items: [],
      payment: { efectivo: '', tarjeta: '' },
    };
  }

  function nextNumberBase() {
    const maxClosed = ordersReport.length ? Math.max(...ordersReport.map(o => o.numeroDia || 0)) : 0;
    return Math.max(maxClosed, currentOrder.localNumber || 0) + 1;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);

      const body = new URLSearchParams();
      body.append('codigo', form.get('codigo'));
      body.append('password', form.get('password'));

      const { data } = await api.post('/auth/login', body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      localStorage.setItem('instante_token', data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('instante_token');
    setToken(null);
    setUser(null);
    setCatalog([]);
  }

  const categories = ['Todos', ...new Set(catalog.map((p) => p.categoria))];
  const filteredCatalog = activeCategory === 'Todos'
    ? catalog
    : catalog.filter((p) => p.categoria === activeCategory);

  function addProduct(product) {
    if (currentOrder.sentToKitchen) return;

    setCurrentOrder((prev) => {
      const existing = prev.items.find((i) => i.productoId === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.productoId === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
          ),
        };
      }
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            productoId: product.id,
            nombre: product.nombre,
            cantidad: 1,
            precio: product.precio,
            tipo: product.tipo,
            components: product.components || [],
          },
        ],
      };
    });

    setMobileTab('pedido');
  }

  function changeQty(productoId, delta) {
    if (currentOrder.sentToKitchen) return;
    setCurrentOrder((prev) => ({
      ...prev,
      items: prev.items
        .map((item) => item.productoId === productoId ? { ...item, cantidad: item.cantidad + delta } : item)
        .filter((item) => item.cantidad > 0),
    }));
  }

  function removeItem(productoId) {
    if (currentOrder.sentToKitchen) return;
    setCurrentOrder((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productoId !== productoId),
    }));
  }

  const total = useMemo(
    () => currentOrder.items.reduce((acc, item) => acc + item.cantidad * item.precio, 0),
    [currentOrder.items]
  );

  const efectivo = Number(currentOrder.payment.efectivo || 0);
  const tarjeta = Number(currentOrder.payment.tarjeta || 0);
  const paid = efectivo + tarjeta;
  const difference = total - paid;
  const canClose = currentOrder.sentToKitchen && total > 0 && difference === 0 && currentOrder.dbId;

  async function sendToKitchen() {
    if (currentOrder.items.length === 0) return alert('Agrega al menos un producto');

    try {
      const { data } = await api.post('/orders', {
        customerLabel: currentOrder.customerLabel,
        items: currentOrder.items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
        })),
      });

      await api.post(`/orders/${data.id}/send-to-kitchen`);
      setCurrentOrder((prev) => ({ ...prev, sentToKitchen: true, dbId: data.id }));
      alert('Pedido enviado a cocina');
      await loadReports();
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo enviar a cocina');
    }
  }

  function quickCash() {
    setCurrentOrder((prev) => ({ ...prev, payment: { efectivo: String(total), tarjeta: '0' } }));
  }

  function quickCard() {
    setCurrentOrder((prev) => ({ ...prev, payment: { efectivo: '0', tarjeta: String(total) } }));
  }

  async function closeOrder() {
    try {
      await api.post(`/orders/${currentOrder.dbId}/close`, { efectivo, tarjeta });

      const ticketData = {
        numero: currentOrder.localNumber,
        cliente: currentOrder.customerLabel || '',
        items: currentOrder.items,
        total,
        efectivo,
        tarjeta,
        fecha: new Date().toLocaleString(),
      };

      setLastTicket(ticketData);

      await loadReports();
      setCurrentOrder(createEmptyOrder(nextNumberBase()));
      setMobileTab('productos');
      setScreen('ticket');
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo cerrar el pedido');
    }
  }

  function newOrder() {
    if (
      currentOrder.items.length > 0 &&
      !window.confirm('Hay un pedido en curso. ¿Crear uno nuevo igualmente?')
    ) return;

    setCurrentOrder(createEmptyOrder(nextNumberBase()));
    setMobileTab('productos');
  }

  function printTicket() {
    window.print();
  }

  function resetProductForm() {
    setProductForm({
      id: null,
      nombre: '',
      categoria: '',
      precio: '',
      tipo: 'simple',
      activo: true,
    });
  }

  function openNewProductForm() {
    resetProductForm();
    setScreen('productos');
  }

  function openEditProductForm(product) {
    setProductForm({
      id: product.id,
      nombre: product.nombre || '',
      categoria: product.categoria || '',
      precio: product.precio || '',
      tipo: product.tipo || 'simple',
      activo: Boolean(product.activo),
    });
    setScreen('productos');
  }

  async function saveProduct(e) {
    e.preventDefault();
    setSavingProduct(true);

    try {
      const payload = {
        nombre: productForm.nombre,
        categoria: productForm.categoria,
        precio: Number(productForm.precio),
        tipo: productForm.tipo,
        activo: productForm.activo,
      };

      if (productForm.id) {
        await api.put(`/products/${productForm.id}`, payload);
      } else {
        await api.post('/products', payload);
      }

      const { data: products } = await api.get('/products');
      setCatalog(products);
      resetProductForm();
      alert(productForm.id ? 'Producto actualizado' : 'Producto creado');
    } catch (error) {
      alert(error.response?.data?.message || 'No se pudo guardar el producto');
    } finally {
      setSavingProduct(false);
    }
  }

  if (!token) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>
          <h1 style={{ margin: 0 }}>Modo Café POS</h1>
          <p style={styles.muted}>Sistema online · estilo nuevo</p>

          <form onSubmit={handleLogin} style={{ display: 'grid', gap: 12 }}>
            <input name="codigo" defaultValue="admin" placeholder="Usuario" style={styles.input} />
            <input name="password" type="password" defaultValue="admin123" placeholder="Contraseña" style={styles.input} />
            <button type="submit" style={styles.primaryButton} disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div style={{ marginTop: 14 }}>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <div style={styles.brand}>🐱 Modo Café POS</div>
          <div style={styles.headerSub}>Hola, {user?.nombre}</div>
        </div>

        <div style={styles.headerActions}>
          <button style={screen === 'pos' ? styles.primaryButton : styles.secondaryButton} onClick={() => setScreen('pos')}>POS</button>
          <button style={screen === 'productos' ? styles.primaryButton : styles.secondaryButton} onClick={() => setScreen('productos')}>Productos</button>
          <button style={screen === 'reportes' ? styles.primaryButton : styles.secondaryButton} onClick={() => { setScreen('reportes'); loadReports(); }}>Reportes</button>
          <button style={styles.secondaryButton} onClick={newOrder}>Nuevo pedido</button>
          <button style={styles.secondaryButton} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀ Claro' : '🌙 Oscuro'}
          </button>
          <button style={styles.secondaryButton} onClick={logout}>Salir</button>
        </div>
      </header>

      {screen === 'pos' ? (
        <>
          <div style={styles.mobileTabs} className="mobile-tabs-force">
            <button style={mobileTab === 'productos' ? styles.primaryButton : styles.secondaryButton} onClick={() => setMobileTab('productos')}>Productos</button>
            <button style={mobileTab === 'pedido' ? styles.primaryButton : styles.secondaryButton} onClick={() => setMobileTab('pedido')}>Pedido actual</button>
          </div>

          <main style={styles.mainGrid} className="main-grid-force">
            <section style={{ ...styles.panel, ...(mobileTab !== 'productos' ? styles.mobileHidden : {}) }} className={mobileTab !== 'productos' ? 'hide-on-mobile' : ''}>
              <div style={styles.orderIntro}>
                <div>
                  <div style={styles.orderBadge}>PEDIDO #{String(currentOrder.localNumber).padStart(3, '0')}</div>
                  <div style={styles.muted}>Takeaway cálido y rápido</div>
                </div>
                <input
                  value={currentOrder.customerLabel}
                  onChange={(e) => setCurrentOrder((prev) => ({ ...prev, customerLabel: e.target.value }))}
                  placeholder="Cliente / label opcional"
                  style={styles.input}
                />
              </div>

              <h2 style={styles.sectionTitle}>Productos</h2>

              <div style={styles.categoryRow}>
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={activeCategory === cat ? styles.primaryButton : styles.secondaryButton}>
                    {cat}
                  </button>
                ))}
              </div>

              <div style={styles.productGrid}>
                {filteredCatalog.map((product) => (
                  <button key={product.id} style={styles.productCard} onClick={() => addProduct(product)}>
                    <div style={styles.productName}>{product.nombre}</div>
                    <div style={styles.muted}>{product.categoria}</div>
                    {product.components?.length ? (
                      <div style={styles.comboText}>{product.components.map(c => c.nombre).join(' + ')}</div>
                    ) : null}
                    <div style={styles.productPrice}>{money(product.precio)}</div>
                  </button>
                ))}
              </div>
            </section>

            <section style={{ ...styles.panel, ...(mobileTab !== 'pedido' ? styles.mobileHidden : {}) }} className={mobileTab !== 'pedido' ? 'hide-on-mobile' : ''}>
              <div style={styles.orderHeader}>
                <div style={styles.orderBig}>Pedido #{String(currentOrder.localNumber).padStart(3, '0')}</div>
                <div style={styles.customerPill}>
                  {currentOrder.customerLabel?.trim()
                    ? `Cliente: ${currentOrder.customerLabel}`
                    : 'Sin nombre de cliente'}
                </div>
              </div>

              <div style={styles.itemsList}>
                {currentOrder.items.length === 0 ? (
                  <div style={styles.emptyState}>Aún no agregaste productos</div>
                ) : currentOrder.items.map((item) => (
                  <div key={item.productoId} style={styles.itemCard}>
                    <div style={{ flex: 1 }}>
                      <div style={styles.itemName}>{item.nombre}</div>
                      {item.components?.length ? (
                        <div style={styles.itemMeta}>{item.components.map(c => c.nombre).join(' + ')}</div>
                      ) : null}
                      <div style={styles.itemMeta}>{money(item.precio)} c/u · Subtotal {money(item.cantidad * item.precio)}</div>
                    </div>

                    <div style={styles.qtyActions}>
                      <button style={styles.miniButton} onClick={() => changeQty(item.productoId, -1)}>-</button>
                      <span style={styles.qtyNumber}>{item.cantidad}</span>
                      <button style={styles.miniButton} onClick={() => changeQty(item.productoId, 1)}>+</button>
                      <button style={styles.deleteButton} onClick={() => removeItem(item.productoId)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}><span>Total</span><b>{money(total)}</b></div>
              </div>

              {!currentOrder.sentToKitchen ? (
                <button style={styles.primaryLargeButton} onClick={sendToKitchen}>Enviar a cocina</button>
              ) : (
                <div style={styles.successBox}>Pedido enviado a cocina ✅</div>
              )}

              <div style={{ marginTop: 20 }}>
                <h3 style={{ marginTop: 0, marginBottom: 10 }}>Cobro</h3>

                <div style={styles.quickActions}>
                  <button style={styles.secondaryButton} onClick={quickCash}>Efectivo exacto</button>
                  <button style={styles.secondaryButton} onClick={quickCard}>Todo tarjeta</button>
                </div>

                <div style={styles.paymentGrid}>
                  <div>
                    <label style={styles.label}>Efectivo</label>
                    <input
                      type="number"
                      value={currentOrder.payment.efectivo}
                      onChange={(e) => setCurrentOrder((prev) => ({ ...prev, payment: { ...prev.payment, efectivo: e.target.value } }))}
                      style={styles.input}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Tarjeta</label>
                    <input
                      type="number"
                      value={currentOrder.payment.tarjeta}
                      onChange={(e) => setCurrentOrder((prev) => ({ ...prev, payment: { ...prev.payment, tarjeta: e.target.value } }))}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.summaryBox}>
                  <div style={styles.summaryRow}><span>Total</span><b>{money(total)}</b></div>
                  <div style={styles.summaryRow}><span>Pagado</span><b>{money(paid)}</b></div>
                  <div style={styles.summaryRow}><span>Diferencia</span><b style={{ color: difference === 0 ? '#2E8B57' : '#b00020' }}>{money(difference)}</b></div>
                </div>

                <button style={canClose ? styles.primaryLargeButton : styles.disabledLargeButton} disabled={!canClose} onClick={closeOrder}>
                  Cerrar pedido
                </button>
              </div>
            </section>
          </main>
        </>
      ) : screen === 'ticket' ? (
        <section style={styles.ticketPage}>
          <div style={styles.ticketCard}>
            <h2 style={{ marginTop: 0, marginBottom: 12 }}>Ticket de venta</h2>

            <div style={styles.ticketBlock}>
              <div style={styles.ticketTitle}>🐱 Modo Café</div>
              <div style={styles.ticketMeta}>Pedido #{String(lastTicket?.numero || 0).padStart(3, '0')}</div>
              <div style={styles.ticketMeta}>{lastTicket?.fecha}</div>
              <div style={styles.ticketMeta}>{lastTicket?.cliente ? `Cliente: ${lastTicket.cliente}` : 'Cliente: -'}</div>
            </div>

            <div style={styles.ticketItems}>
              {lastTicket?.items?.map((item) => (
                <div key={item.productoId} style={styles.ticketRow}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.nombre}</div>
                    <div style={styles.ticketMeta}>{item.cantidad} x {money(item.precio)}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{money(item.cantidad * item.precio)}</div>
                </div>
              ))}
            </div>

            <div style={styles.ticketTotals}>
              <div style={styles.summaryRow}><span>Total</span><b>{money(lastTicket?.total)}</b></div>
              <div style={styles.summaryRow}><span>Efectivo</span><b>{money(lastTicket?.efectivo)}</b></div>
              <div style={styles.summaryRow}><span>Tarjeta</span><b>{money(lastTicket?.tarjeta)}</b></div>
            </div>

            <div style={styles.ticketActions}>
              <button style={styles.secondaryButton} onClick={printTicket}>Imprimir</button>
              <button
                style={styles.primaryButton}
                onClick={() => {
                  setLastTicket(null);
                  setScreen('pos');
                  setCurrentOrder(createEmptyOrder(nextNumberBase()));
                }}
              >
                Nuevo pedido
              </button>
              <button style={styles.secondaryButton} onClick={() => setScreen('reportes')}>Ir a reportes</button>
            </div>
          </div>
        </section>
      ) : screen === 'productos' ? (
        <section style={styles.productsPage}>
          <div style={styles.productsLayout} className="report-grid-force">
            <div style={styles.panel}>
              <div style={styles.productsActions}>
                <button style={styles.primaryButton} onClick={openNewProductForm}>+ Nuevo producto</button>
                <button style={styles.secondaryButton} onClick={() => loadBootstrap()}>Actualizar lista</button>
              </div>

              <h2 style={styles.sectionTitle}>Productos activos</h2>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th>Tipo</th>
                      <th>Precio</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.map((product) => (
                      <tr key={product.id}>
                        <td>{product.nombre}</td>
                        <td>{product.categoria}</td>
                        <td>{product.tipo}</td>
                        <td>{money(product.precio)}</td>
                        <td>
                          <button style={styles.secondaryButton} onClick={() => openEditProductForm(product)}>Editar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={styles.panel}>
              <h2 style={styles.sectionTitle}>{productForm.id ? 'Editar producto' : 'Nuevo producto'}</h2>

              <form onSubmit={saveProduct} style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Nombre</label>
                  <input
                    value={productForm.nombre}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, nombre: e.target.value }))}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Categoría</label>
                  <input
                    value={productForm.categoria}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, categoria: e.target.value }))}
                    style={styles.input}
                    placeholder="Cafés, Comidas, Bebidas..."
                  />
                </div>

                <div>
                  <label style={styles.label}>Precio</label>
                  <input
                    type="number"
                    value={productForm.precio}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, precio: e.target.value }))}
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Tipo</label>
                  <select
                    value={productForm.tipo}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, tipo: e.target.value }))}
                    style={styles.input}
                  >
                    <option value="simple">Simple</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>

                <label style={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={productForm.activo}
                    onChange={(e) => setProductForm((prev) => ({ ...prev, activo: e.target.checked }))}
                  />
                  Activo
                </label>

                <div style={styles.productsActions}>
                  <button type="submit" style={styles.primaryButton} disabled={savingProduct}>
                    {savingProduct ? 'Guardando...' : (productForm.id ? 'Guardar cambios' : 'Crear producto')}
                  </button>
                  <button type="button" style={styles.secondaryButton} onClick={resetProductForm}>
                    Limpiar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <section style={styles.reportSection}>
          <h2 style={styles.sectionTitle}>Reporte de comandas</h2>
          <div style={styles.reportGrid} className="report-grid-force">
            <div style={styles.panel}>
              <h3 style={{ marginTop: 0 }}>Comandas cerradas</h3>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr><th>#</th><th>Cliente</th><th>Total</th><th>Efectivo</th><th>Tarjeta</th></tr>
                  </thead>
                  <tbody>
                    {ordersReport.map((order) => (
                      <tr key={order.id}>
                        <td>{String(order.numeroDia).padStart(3, '0')}</td>
                        <td>{order.customerLabel || '-'}</td>
                        <td>{money(order.total)}</td>
                        <td>{money(order.efectivo)}</td>
                        <td>{money(order.tarjeta)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={styles.panel}>
              <h3 style={{ marginTop: 0 }}>Productos más vendidos</h3>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead><tr><th>Producto</th><th>Cantidad</th></tr></thead>
                  <tbody>
                    {topProducts.map((item) => (
                      <tr key={item.nombre}><td>{item.nombre}</td><td>{item.cantidad}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const styleTag = document.createElement('style');
styleTag.innerHTML = `
  body { margin: 0; }
  table th, table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  @media (max-width: 900px) {
    .mobile-tabs-force { display: flex !important; }
    .main-grid-force, .report-grid-force { grid-template-columns: 1fr !important; }
    .hide-on-mobile { display: none !important; }
  }
`;
document.head.appendChild(styleTag);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);
