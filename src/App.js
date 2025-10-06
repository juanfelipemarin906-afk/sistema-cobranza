import React, { useState } from 'react';

// Mock data structure with separate products per collector
const initialCollectors = [
  { id: 1, name: 'Carlos Méndez', phone: '310-111-1111', commission: 5 },
  { id: 2, name: 'María López', phone: '311-222-2222', commission: 6 },
  { id: 3, name: 'Pedro Sánchez', phone: '312-333-3333', commission: 4 },
];

// Products - now global for admin management
const initialProducts = [
  { id: 1, name: 'Leche Entera', category: 'Lácteos', price: 4500, commission: 5, stock: 120, image: 'https://placehold.co/100x100/27ae60/white?text=🥛' },
  { id: 2, name: 'Yogur Natural', category: 'Yogures', price: 3200, commission: 6, stock: 85, image: 'https://placehold.co/100x100/f1c40f/white?text=🥄' },
  { id: 3, name: 'Queso Panela', category: 'Lácteos', price: 8500, commission: 4, stock: 60, image: 'https://placehold.co/100x100/3498db/white?text=🧀' },
  { id: 4, name: 'Leche Deslactosada', category: 'Lácteos', price: 5200, commission: 6, stock: 95, image: 'https://placehold.co/100x100/e74c3c/white?text=🥛' },
  { id: 5, name: 'Yogur Griego', category: 'Yogures', price: 4800, commission: 7, stock: 70, image: 'https://placehold.co/100x100/9b59b6/white?text=🥄' },
  { id: 6, name: 'Jamón de Pavo', category: 'Carnes Frías', price: 28500, commission: 5, stock: 40, image: 'https://placehold.co/100x100/2ecc71/white?text=🍖' },
];

// Clients assigned to collectors
const initialClients = [
  { id: 1, name: 'Supermercado La Esquina', phone: '310-123-4567', address: 'Av. Principal 123', creditLimit: 850000, collectorId: 1, products: [1, 2, 3], paymentFrequency: 'semanal' },
  { id: 2, name: 'Tienda Don Juan', phone: '311-567-8901', address: 'Calle Secundaria 456', creditLimit: 520000, collectorId: 2, products: [4, 5, 6], paymentFrequency: 'diario' },
  { id: 3, name: 'Mini Market Central', phone: '312-901-2345', address: 'Plaza Central 789', creditLimit: 700000, collectorId: 1, products: [1, 3], paymentFrequency: 'mensual' },
  { id: 4, name: 'Almacén El Progreso', phone: '313-234-5678', address: 'Carrera 45 #78-90', creditLimit: 650000, collectorId: 2, products: [4, 6], paymentFrequency: 'semanal' },
  { id: 5, name: 'Tienda La Economía', phone: '314-345-6789', address: 'Diagonal 23 #45-67', creditLimit: 480000, collectorId: 3, products: [2, 5], paymentFrequency: 'diario' },
];

// Debts and payments
const initialDebts = [
  { id: 1, clientId: 1, amount: 220000, daysOverdue: 3, status: 'pending', collectorId: 1, date: '2024-01-12', totalInstallments: 4, paidInstallments: 1 },
  { id: 2, clientId: 2, amount: 157000, daysOverdue: 7, status: 'pending', collectorId: 2, date: '2024-01-08', totalInstallments: 10, paidInstallments: 3 },
  { id: 3, clientId: 3, amount: 370000, daysOverdue: 1, status: 'pending', collectorId: 1, date: '2024-01-14', totalInstallments: 2, paidInstallments: 0 },
  { id: 4, clientId: 4, amount: 285000, daysOverdue: 2, status: 'pending', collectorId: 2, date: '2024-01-13', totalInstallments: 4, paidInstallments: 1 },
  { id: 5, clientId: 5, amount: 195000, daysOverdue: 5, status: 'pending', collectorId: 3, date: '2024-01-10', totalInstallments: 15, paidInstallments: 5 },
];

const initialPayments = [
  { id: 1, clientId: 1, amount: 132000, date: '2024-01-15', collectorId: 1 },
  { id: 2, clientId: 2, amount: 212000, date: '2024-01-14', collectorId: 2 },
];

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // State for data management
  const [collectors, setCollectors] = useState(initialCollectors);
  const [products, setProducts] = useState(initialProducts);
  const [clients, setClients] = useState(initialClients);
  const [debts, setDebts] = useState(initialDebts);
  const [payments, setPayments] = useState(initialPayments);
  
  // Form states
  const [showClientForm, setShowClientForm] = useState(false);
  const [showCollectorForm, setShowCollectorForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [editingCollector, setEditingCollector] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState('');
  
  // Form data
  const [clientFormData, setClientFormData] = useState({
    name: '',
    phone: '',
    address: '',
    creditLimit: '',
    collectorId: '',
    products: [],
    paymentFrequency: 'diario'
  });
  
  const [collectorFormData, setCollectorFormData] = useState({
    name: '',
    phone: '',
    commission: ''
  });
  
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Lácteos',
    price: '',
    commission: '',
    stock: '',
    image: ''
  });
  
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    paymentMethod: 'efectivo'
  });

  // Login credentials with roles
  const validCredentials = {
    admin: { password: 'admin123', role: 'admin', collectorId: null },
    carlos: { password: 'carlos123', role: 'collector', collectorId: 1 },
    maria: { password: 'maria123', role: 'collector', collectorId: 2 },
    pedro: { password: 'pedro123', role: 'collector', collectorId: 3 }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = validCredentials[username];
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setCurrentUser(username);
      setUserRole(user.role);
    } else {
      alert('Credenciales incorrectas. Intente nuevamente.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRole(null);
    setUsername('');
    setPassword('');
  };

  // Get current user's collector ID
  const getCurrentUserCollectorId = () => {
    if (userRole === 'collector') {
      return validCredentials[username]?.collectorId;
    }
    return null;
  };

  // Get products for current user (all products for collectors)
  const getCurrentUserProducts = () => {
    return products;
  };

  // Get clients for current user
  const getCurrentUserClients = () => {
    if (userRole === 'admin') {
      return clients;
    } else if (userRole === 'collector') {
      const collectorId = getCurrentUserCollectorId();
      return clients.filter(client => client.collectorId === collectorId);
    }
    return [];
  };

  // Get debts for current user
  const getCurrentUserDebts = () => {
    if (userRole === 'admin') {
      return debts.filter(d => d.status === 'pending');
    } else if (userRole === 'collector') {
      const collectorId = getCurrentUserCollectorId();
      return debts.filter(debt => debt.collectorId === collectorId && debt.status === 'pending');
    }
    return [];
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Dashboard calculations
  const todayDate = getTodayDate();
  const currentUserCollectorId = getCurrentUserCollectorId();
  const currentUserProducts = getCurrentUserProducts();
  const currentUserClients = getCurrentUserClients();
  const currentUserDebts = getCurrentUserDebts();
  
  const totalCollectedToday = payments
    .filter(p => p.date === todayDate && (userRole === 'admin' || p.collectorId === currentUserCollectorId))
    .reduce((sum, p) => sum + p.amount, 0);
    
  const totalPending = currentUserDebts.reduce((sum, d) => sum + d.amount, 0);
  
  const myCommissions = userRole === 'collector' ? 
    currentUserDebts.reduce((sum, d) => sum + (d.amount * (collectors.find(c => c.id === currentUserCollectorId)?.commission || 0) / 100), 0) : 0;
  
  const delinquentClients = currentUserDebts
    .filter(d => d.daysOverdue > 0)
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .map(debt => ({
      ...debt,
      clientName: clients.find(c => c.id === debt.clientId)?.name || 'Cliente desconocido'
    }));

  // Client form handlers - collectors can add, edit, delete their clients
  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (userRole !== 'collector') return;
    
    if (editingClient) {
      // Update existing client
      setClients(prevClients => 
        prevClients.map(c => 
          c.id === editingClient.id 
            ? { ...c, ...clientFormData, creditLimit: parseFloat(clientFormData.creditLimit) }
            : c
        )
      );
    } else {
      // Add new client - collectors can only add to themselves
      const newClient = {
        id: Math.max(...clients.map(c => c.id), 0) + 1,
        ...clientFormData,
        creditLimit: parseFloat(clientFormData.creditLimit),
        collectorId: getCurrentUserCollectorId(),
        products: clientFormData.products
      };
      setClients(prevClients => [...prevClients, newClient]);
    }
    resetClientForm();
  };

  const handleEditClient = (client) => {
    if (userRole !== 'collector') return;
    setEditingClient(client);
    setClientFormData({
      name: client.name,
      phone: client.phone,
      address: client.address,
      creditLimit: client.creditLimit.toString(),
      collectorId: client.collectorId.toString(),
      products: client.products || [],
      paymentFrequency: client.paymentFrequency || 'diario'
    });
    setShowClientForm(true);
  };

  const handleDeleteClient = (id) => {
    if (userRole !== 'collector') return;
    
    // Check if client has pending debts
    const hasPendingDebts = debts.some(debt => debt.clientId === id && debt.status === 'pending');
    if (hasPendingDebts) {
      alert('No se puede eliminar un cliente con cuentas pendientes.');
      return;
    }
    
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      setClients(prevClients => prevClients.filter(c => c.id !== id));
      // Also remove any debts associated with this client
      setDebts(prevDebts => prevDebts.filter(d => d.clientId !== id));
    }
  };

  const resetClientForm = () => {
    setShowClientForm(false);
    setEditingClient(null);
    setClientFormData({
      name: '',
      phone: '',
      address: '',
      creditLimit: '',
      collectorId: userRole === 'collector' ? getCurrentUserCollectorId().toString() : '',
      products: [],
      paymentFrequency: 'diario'
    });
  };

  // Toggle product selection
  const toggleProductSelection = (productId) => {
    setClientFormData(prev => {
      const currentProducts = prev.products || [];
      if (currentProducts.includes(productId)) {
        return {
          ...prev,
          products: currentProducts.filter(id => id !== productId)
        };
      } else {
        return {
          ...prev,
          products: [...currentProducts, productId]
        };
      }
    });
  };

  // Collector form handlers (admin only)
  const handleCollectorSubmit = (e) => {
    e.preventDefault();
    if (userRole !== 'admin') return;
    
    if (editingCollector) {
      // Update existing collector
      setCollectors(prevCollectors => 
        prevCollectors.map(c => 
          c.id === editingCollector.id 
            ? { ...c, ...collectorFormData, commission: parseFloat(collectorFormData.commission) }
            : c
        )
      );
    } else {
      // Add new collector
      const newCollector = {
        id: Math.max(...collectors.map(c => c.id), 0) + 1,
        ...collectorFormData,
        commission: parseFloat(collectorFormData.commission)
      };
      setCollectors(prevCollectors => [...prevCollectors, newCollector]);
    }
    resetCollectorForm();
  };

  const handleEditCollector = (collector) => {
    if (userRole !== 'admin') return;
    setEditingCollector(collector);
    setCollectorFormData({
      name: collector.name,
      phone: collector.phone,
      commission: collector.commission.toString()
    });
    setShowCollectorForm(true);
  };

  const handleDeleteCollector = (id) => {
    if (userRole !== 'admin') return;
    
    // Check if collector has assigned clients
    const hasAssignedClients = clients.some(client => client.collectorId === id);
    if (hasAssignedClients) {
      alert('No se puede eliminar un cobrador con clientes asignados.');
      return;
    }
    
    if (window.confirm('¿Está seguro de eliminar este cobrador?')) {
      setCollectors(prevCollectors => prevCollectors.filter(c => c.id !== id));
    }
  };

  const resetCollectorForm = () => {
    setShowCollectorForm(false);
    setEditingCollector(null);
    setCollectorFormData({
      name: '',
      phone: '',
      commission: ''
    });
  };

  // Product form handlers (admin only)
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (userRole !== 'admin') return;
    
    if (editingProduct) {
      // Update existing product
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === editingProduct.id 
            ? { ...p, ...productFormData, price: parseFloat(productFormData.price), commission: parseFloat(productFormData.commission), stock: parseInt(productFormData.stock) }
            : p
        )
      );
    } else {
      // Add new product
      const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        ...productFormData,
        price: parseFloat(productFormData.price),
        commission: parseFloat(productFormData.commission),
        stock: parseInt(productFormData.stock),
        image: productFormData.image || 'https://placehold.co/100x100/27ae60/white?text=🥛'
      };
      setProducts(prevProducts => [...prevProducts, newProduct]);
    }
    resetProductForm();
  };

  const handleEditProduct = (product) => {
    if (userRole !== 'admin') return;
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      commission: product.commission.toString(),
      stock: product.stock.toString(),
      image: product.image
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id) => {
    if (userRole !== 'admin') return;
    
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    }
  };

  const resetProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: 'Lácteos',
      price: '',
      commission: '',
      stock: '',
      image: ''
    });
  };

  // Generate WhatsApp message
  const generateWhatsAppMessage = (client, paymentAmount, remainingDebt, remainingInstallments, totalInstallments, frequency) => {
    const frequencyText = {
      'diario': 'Diario',
      'semanal': 'Semanal',
      'mensual': 'Mensual'
    };
    
    const message = `¡Gracias por su pago! 🎉\n\n` +
                   `Monto abonado: ${formatCOP(paymentAmount)}\n` +
                   `Saldo mora: ${formatCOP(remainingDebt)}\n` +
                   `Cuotas restantes: ${remainingInstallments} de ${totalInstallments}\n` +
                   `Días que paga: ${frequencyText[frequency]}\n\n` +
                   `¡Seguimos trabajando juntos! 💪`;
    
    return message;
  };

  // Payment handlers
  const handleRegisterPayment = (debt) => {
    setSelectedDebt(debt);
    setPaymentFormData({
      amount: debt.amount.toString(),
      paymentMethod: 'efectivo'
    });
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    const paymentAmount = parseFloat(paymentFormData.amount);
    const debtAmount = selectedDebt.amount;
    
    if (paymentAmount <= 0) {
      alert('El monto del pago debe ser mayor a 0.');
      return;
    }
    
    if (paymentAmount > debtAmount) {
      alert('El monto del pago no puede ser mayor al monto adeudado.');
      return;
    }
    
    // Create payment record with today's date
    const today = getTodayDate();
    const newPayment = {
      id: Math.max(...payments.map(p => p.id), 0) + 1,
      clientId: selectedDebt.clientId,
      amount: paymentAmount,
      date: today,
      collectorId: selectedDebt.collectorId,
      paymentMethod: paymentFormData.paymentMethod
    };
    
    setPayments(prev => [...prev, newPayment]);
    
    const client = clients.find(c => c.id === selectedDebt.clientId);
    let updatedDebts = [...debts];
    
    if (paymentAmount === debtAmount) {
      // Full payment - mark as paid
      updatedDebts = updatedDebts.map(d => 
        d.id === selectedDebt.id ? { ...d, status: 'paid' } : d
      );
      
      // Generate WhatsApp message for full payment
      const message = `¡Gracias por su pago! 🎉\n\n` +
                     `Monto abonado: ${formatCOP(paymentAmount)}\n` +
                     `Saldo mora: ${formatCOP(0)}\n` +
                     `Cuotas restantes: 0 de ${selectedDebt.totalInstallments}\n` +
                     `Días que paga: ${selectedDebt.paymentFrequency === 'diario' ? 'Diario' : selectedDebt.paymentFrequency === 'semanal' ? 'Semanal' : 'Mensual'}\n\n` +
                     `¡Su cuenta está al día! 💪`;
      
      setWhatsAppMessage(message);
      setShowWhatsAppModal(true);
      
    } else {
      // Partial payment - update amount and installments
      const remainingAmount = debtAmount - paymentAmount;
      const installmentsPerPayment = selectedDebt.totalInstallments / selectedDebt.amount;
      const installmentsPaid = Math.floor(paymentAmount * installmentsPerPayment);
      const newPaidInstallments = selectedDebt.paidInstallments + installmentsPaid;
      const remainingInstallments = selectedDebt.totalInstallments - newPaidInstallments;
      
      updatedDebts = updatedDebts.map(d => 
        d.id === selectedDebt.id ? { 
          ...d, 
          amount: remainingAmount,
          paidInstallments: newPaidInstallments
        } : d
      );
      
      // Generate WhatsApp message for partial payment
      const message = generateWhatsAppMessage(
        client,
        paymentAmount,
        remainingAmount,
        remainingInstallments,
        selectedDebt.totalInstallments,
        client.paymentFrequency
      );
      
      setWhatsAppMessage(message);
      setShowWhatsAppModal(true);
    }
    
    setDebts(updatedDebts);
    resetPaymentForm();
  };

  const resetPaymentForm = () => {
    setShowPaymentForm(false);
    setSelectedDebt(null);
    setPaymentFormData({
      amount: '',
      paymentMethod: 'efectivo'
    });
  };

  // Format currency for Colombian pesos
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get product names by IDs
  const getProductNamesByIds = (productIds) => {
    return productIds
      .map(id => products.find(p => p.id === id)?.name)
      .filter(name => name)
      .join(', ');
  };

  // Open WhatsApp with pre-filled message
  const openWhatsApp = () => {
    const client = clients.find(c => c.id === selectedDebt?.clientId);
    if (client) {
      const phoneNumber = client.phone.replace(/\D/g, ''); // Remove non-digits
      const encodedMessage = encodeURIComponent(whatsAppMessage);
      const whatsappUrl = `https://wa.me/57${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
    setShowWhatsAppModal(false);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f0fdf4', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px' 
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
          padding: '32px', 
          width: '100%', 
          maxWidth: '400px' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              backgroundColor: '#27ae60', 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px' 
            }}>
              <span style={{ color: 'white', fontSize: '24px' }}>📦</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              Sistema de Gestión y Cobranza
            </h1>
            <p style={{ color: '#6b7280' }}>Distribuidora de Alimentos</p>
          </div>
          
          <form onSubmit={handleLogin} style={{ spaceY: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '8px' }}>
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '8px' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#27ae60',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Iniciar Sesión
            </button>
          </form>
          
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
            <h3 style={{ fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>Credenciales de prueba:</h3>
            <div style={{ fontSize: '14px', color: '#2563eb' }}>
              <p><strong>Administrador:</strong> admin / admin123</p>
              <p><strong>Cobrador Carlos:</strong> carlos / carlos123</p>
              <p><strong>Cobrador María:</strong> maria / maria123</p>
              <p><strong>Cobrador Pedro:</strong> pedro / pedro123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Navigation items based on role
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'payments', label: 'Pagos', icon: '💳' },
    ];
    
    if (userRole === 'admin') {
      return [
        ...baseItems,
        { id: 'products', label: 'Productos', icon: '🥛' },
        { id: 'clients', label: 'Clientes', icon: '👥' },
        { id: 'collectors', label: 'Cobradores', icon: '🚴' },
        { id: 'reports', label: 'Reportes', icon: '📈' }
      ];
    } else if (userRole === 'collector') {
      return [
        ...baseItems,
        { id: 'products', label: 'Productos', icon: '🥛' },
        { id: 'clients', label: 'Mis Clientes', icon: '👥' }
      ];
    }
    return baseItems;
  };

  // Simple styles object
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    header: {
      backgroundColor: 'white',
      padding: '16px',
      marginBottom: '20px',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    nav: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '24px'
    },
    navButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: '1px solid #e5e7eb',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'medium'
    },
    navButtonActive: {
      padding: '8px 16px',
      borderRadius: '6px',
      backgroundColor: '#27ae60',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'medium'
    },
    card: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      borderLeft: '4px solid #27ae60'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '16px'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      borderBottom: '2px solid #e5e7eb',
      fontWeight: 'bold'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e5e7eb'
    },
    button: {
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      marginRight: '8px'
    },
    primaryButton: {
      backgroundColor: '#27ae60',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    dangerButton: {
      backgroundColor: '#fee2e2',
      color: '#ef4444',
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    },
    successButton: {
      backgroundColor: '#dbeafe',
      color: '#2563eb',
      padding: '6px 12px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            backgroundColor: '#27ae60', 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white' }}>📦</span>
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>Sistema de Cobranza</h1>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Distribuidora de Alimentos</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '14px', fontWeight: 'medium', color: '#1f2937' }}>{currentUser}</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>{userRole === 'admin' ? 'Administrador' : 'Cobrador'}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#fee2e2', 
              color: '#ef4444', 
              padding: '8px 16px', 
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        {getNavigationItems().map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            style={currentView === item.id ? styles.navButtonActive : styles.navButton}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <div>
          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            <div style={{ ...styles.statCard, borderLeftColor: '#27ae60' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Cobrado Hoy</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{formatCOP(totalCollectedToday)}</p>
            </div>

            <div style={{ ...styles.statCard, borderLeftColor: '#ef4444' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Total Pendiente</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{formatCOP(totalPending)}</p>
            </div>

            {userRole === 'collector' && (
              <div style={{ ...styles.statCard, borderLeftColor: '#f59e0b' }}>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Mis Comisiones</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{formatCOP(myCommissions)}</p>
              </div>
            )}

            <div style={{ ...styles.statCard, borderLeftColor: '#3b82f6' }}>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>Clientes Morosos</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{delinquentClients.length}</p>
            </div>
          </div>

          {/* Delinquent Clients */}
          {delinquentClients.length > 0 && (
            <div style={styles.card}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Clientes Morosos 🚨</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {delinquentClients.map((client) => (
                  <div key={client.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px', 
                    backgroundColor: '#fee2e2', 
                    borderRadius: '6px' 
                  }}>
                    <div>
                      <p style={{ fontWeight: 'medium', color: '#1f2937' }}>{client.clientName}</p>
                      <p style={{ fontSize: '14px', color: '#ef4444' }}>{formatCOP(client.amount)} - {client.daysOverdue} días</p>
                    </div>
                    <span>⏰</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clients View */}
      {currentView === 'clients' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>
              {userRole === 'admin' ? 'Clientes 👥' : 'Mis Clientes 👥'}
            </h2>
            {userRole === 'collector' && (
              <button 
                onClick={() => {
                  setEditingClient(null);
                  setShowClientForm(true);
                }}
                style={styles.primaryButton}
              >
                + Nuevo Cliente
              </button>
            )}
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Cliente</th>
                  <th style={styles.th}>Teléfono</th>
                  <th style={styles.th}>Dirección</th>
                  <th style={styles.th}>Límite Crédito</th>
                  <th style={styles.th}>Frecuencia</th>
                  <th style={styles.th}>Productos</th>
                  {userRole === 'admin' && <th style={styles.th}>Cobrador</th>}
                  <th style={styles.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentUserClients.map((client) => (
                  <tr key={client.id}>
                    <td style={{ ...styles.td, fontWeight: 'medium' }}>{client.name}</td>
                    <td style={styles.td}>{client.phone}</td>
                    <td style={styles.td}>{client.address}</td>
                    <td style={styles.td}>{formatCOP(client.creditLimit)}</td>
                    <td style={styles.td}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: 'bold',
                        backgroundColor: client.paymentFrequency === 'diario' ? '#dbeafe' : 
                                      client.paymentFrequency === 'semanal' ? '#dcfce7' : '#ede9fe',
                        color: client.paymentFrequency === 'diario' ? '#2563eb' : 
                                client.paymentFrequency === 'semanal' ? '#16a34a' : '#7c3aed'
                      }}>
                        {client.paymentFrequency === 'diario' ? 'Diario' : 
                         client.paymentFrequency === 'semanal' ? 'Semanal' : 'Mensual'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {getProductNamesByIds(client.products || []).substring(0, 20)}
                      {getProductNamesByIds(client.products || []).length > 20 ? '...' : ''}
                    </td>
                    {userRole === 'admin' && (
                      <td style={styles.td}>
                        {collectors.find(c => c.id === client.collectorId)?.name || 'Sin asignar'}
                      </td>
                    )}
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {userRole === 'collector' && (
                          <>
                            <button 
                              onClick={() => handleEditClient(client)}
                              style={styles.successButton}
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteClient(client.id)}
                              style={styles.dangerButton}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                        {userRole === 'admin' && (
                          <span style={{ color: '#9ca3af' }}>Ver</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Client Form Modal */}
          {showClientForm && userRole === 'collector' && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                width: '90%', 
                maxWidth: '500px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                  </h3>
                  <button 
                    onClick={resetClientForm} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '20px', 
                      cursor: 'pointer' 
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleClientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Nombre/Razón Social
                    </label>
                    <input
                      type="text"
                      value={clientFormData.name}
                      onChange={(e) => setClientFormData({...clientFormData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={clientFormData.phone}
                      onChange={(e) => setClientFormData({...clientFormData, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="310-123-4567"
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={clientFormData.address}
                      onChange={(e) => setClientFormData({...clientFormData, address: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Límite de Crédito (COP)
                    </label>
                    <input
                      type="number"
                      value={clientFormData.creditLimit}
                      onChange={(e) => setClientFormData({...clientFormData, creditLimit: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Frecuencia de Pago
                    </label>
                    <select
                      value={clientFormData.paymentFrequency}
                      onChange={(e) => setClientFormData({...clientFormData, paymentFrequency: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="diario">Diario</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Productos que vende
                    </label>
                    <div style={{ 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px', 
                      padding: '12px', 
                      maxHeight: '200px', 
                      overflowY: 'auto'
                    }}>
                      {products.map(product => (
                        <div key={product.id} style={{ display: 'flex', alignItems: 'center', padding: '6px 0' }}>
                          <input
                            type="checkbox"
                            id={`product-${product.id}`}
                            checked={clientFormData.products.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            style={{ marginRight: '12px' }}
                          />
                          <label htmlFor={`product-${product.id}`} style={{ fontSize: '14px', flex: 1 }}>
                            {product.name} - {formatCOP(product.price)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                    <button
                      type="submit"
                      style={styles.primaryButton}
                    >
                      {editingClient ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={resetClientForm}
                      style={{ 
                        flex: 1, 
                        backgroundColor: '#e5e7eb', 
                        color: '#1f2937', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payments View */}
      {currentView === 'payments' && (
        <div style={styles.card}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Registro de Pagos 💳</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentUserDebts.map((debt) => (
              <div key={debt.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '16px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold', color: '#1f2937' }}>
                      {clients.find(c => c.id === debt.clientId)?.name || 'Cliente desconocido'}
                    </h3>
                    <p style={{ color: '#ef4444', fontWeight: 'medium' }}>{formatCOP(debt.amount)}</p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>Atrasado: {debt.daysOverdue} días</p>
                    <p style={{ fontSize: '14px', color: '#2563eb' }}>
                      Cuotas: {debt.paidInstallments} de {debt.totalInstallments}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleRegisterPayment(debt)}
                    style={styles.primaryButton}
                  >
                    Registrar Pago
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Form Modal */}
          {showPaymentForm && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                width: '90%', 
                maxWidth: '500px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Registrar Pago</h3>
                  <button 
                    onClick={resetPaymentForm} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '20px', 
                      cursor: 'pointer' 
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '8px'
                }}>
                  <p style={{ fontWeight: 'bold' }}>
                    Cliente: {clients.find(c => c.id === selectedDebt?.clientId)?.name}
                  </p>
                  <p style={{ color: '#ef4444' }}>
                    Monto adeudado: {formatCOP(selectedDebt?.amount || 0)}
                  </p>
                  <p style={{ color: '#2563eb' }}>
                    Cuotas: {selectedDebt?.paidInstallments || 0} de {selectedDebt?.totalInstallments || 1}
                  </p>
                </div>
                
                <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Monto a pagar (COP)
                    </label>
                    <input
                      type="number"
                      value={paymentFormData.amount}
                      onChange={(e) => setPaymentFormData({...paymentFormData, amount: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                      min="1"
                      max={selectedDebt?.amount}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Método de Pago
                    </label>
                    <select
                      value={paymentFormData.paymentMethod}
                      onChange={(e) => setPaymentFormData({...paymentFormData, paymentMethod: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="efectivo">Efectivo</option>
                      <option value="transferencia">Transferencia</option>
                      <option value="tarjeta">Tarjeta</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                    <button
                      type="submit"
                      style={styles.primaryButton}
                    >
                      Registrar Pago
                    </button>
                    <button
                      type="button"
                      onClick={resetPaymentForm}
                      style={{ 
                        flex: 1, 
                        backgroundColor: '#e5e7eb', 
                        color: '#1f2937', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products View */}
      {currentView === 'products' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Productos 🥛</h2>
            {userRole === 'admin' && (
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setShowProductForm(true);
                }}
                style={styles.primaryButton}
              >
                + Nuevo Producto
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {getCurrentUserProducts().map((product) => (
              <div key={product.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '16px',
                textAlign: 'center'
              }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '64px', height: '64px', borderRadius: '8px', margin: '0 auto 12px' }}
                />
                <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{product.name}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{product.category}</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#27ae60', marginBottom: '4px' }}>{formatCOP(product.price)}</p>
                <p style={{ fontSize: '14px', color: '#2563eb' }}>Comisión: {product.commission}%</p>
                {userRole === 'admin' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'center' }}>
                    <button 
                      onClick={() => handleEditProduct(product)}
                      style={styles.successButton}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      style={styles.dangerButton}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Product Form Modal */}
          {showProductForm && userRole === 'admin' && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                width: '90%', 
                maxWidth: '500px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>
                  <button 
                    onClick={resetProductForm} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '20px', 
                      cursor: 'pointer' 
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Categoría
                    </label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="Lácteos">Lácteos</option>
                      <option value="Carnes Frías">Carnes Frías</option>
                      <option value="Yogures">Yogures</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Precio (COP)
                    </label>
                    <input
                      type="number"
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Comisión (%)
                    </label>
                    <input
                      type="number"
                      value={productFormData.commission}
                      onChange={(e) => setProductFormData({...productFormData, commission: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Stock
                    </label>
                    <input
                      type="number"
                      value={productFormData.stock}
                      onChange={(e) => setProductFormData({...productFormData, stock: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      URL de Imagen (opcional)
                    </label>
                    <input
                      type="text"
                      value={productFormData.image}
                      onChange={(e) => setProductFormData({...productFormData, image: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                    <button
                      type="submit"
                      style={styles.primaryButton}
                    >
                      {editingProduct ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={resetProductForm}
                      style={{ 
                        flex: 1, 
                        backgroundColor: '#e5e7eb', 
                        color: '#1f2937', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collectors View - Admin only */}
      {currentView === 'collectors' && userRole === 'admin' && (
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Gestión de Cobradores 🚴</h2>
            <button 
              onClick={() => {
                setEditingCollector(null);
                setShowCollectorForm(true);
              }}
              style={styles.primaryButton}
            >
              + Nuevo Cobrador
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {collectors.map((collector) => (
              <div key={collector.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ 
                    backgroundColor: '#dbeafe', 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: '#2563eb' }}>👤</span>
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{collector.name}</h3>
                    <p style={{ fontSize: '14px', color: '#2563eb' }}>{collector.commission}% comisión</p>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  <span>📞</span> {collector.phone}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => handleEditCollector(collector)}
                    style={styles.successButton}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDeleteCollector(collector.id)}
                    style={styles.dangerButton}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Collector Form Modal */}
          {showCollectorForm && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                width: '90%', 
                maxWidth: '500px' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {editingCollector ? 'Editar Cobrador' : 'Nuevo Cobrador'}
                  </h3>
                  <button 
                    onClick={resetCollectorForm} 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      fontSize: '20px', 
                      cursor: 'pointer' 
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleCollectorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={collectorFormData.name}
                      onChange={(e) => setCollectorFormData({...collectorFormData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={collectorFormData.phone}
                      onChange={(e) => setCollectorFormData({...collectorFormData, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="310-123-4567"
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                      Porcentaje de Comisión (%)
                    </label>
                    <input
                      type="number"
                      value={collectorFormData.commission}
                      onChange={(e) => setCollectorFormData({...collectorFormData, commission: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
                    <button
                      type="submit"
                      style={styles.primaryButton}
                    >
                      {editingCollector ? 'Actualizar' : 'Guardar'}
                    </button>
                    <button
                      type="button"
                      onClick={resetCollectorForm}
                      style={{ 
                        flex: 1, 
                        backgroundColor: '#e5e7eb', 
                        color: '#1f2937', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reports View - Admin only */}
      {currentView === 'reports' && userRole === 'admin' && (
        <div style={styles.card}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Reportes 📈</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Resumen General</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Cobrado</span>
                  <span style={{ fontWeight: 'bold', color: '#27ae60' }}>{formatCOP(payments.reduce((sum, p) => sum + p.amount, 0))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Pendiente</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444' }}>{formatCOP(debts.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount, 0))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Clientes</span>
                  <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{clients.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Cobradores</span>
                  <span style={{ fontWeight: 'bold', color: '#8b5cf6' }}>{collectors.length}</span>
                </div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Reporte por Cobrador</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {collectors.map(collector => {
                  const collectorPayments = payments.filter(p => p.collectorId === collector.id);
                  const collectorDebts = debts.filter(d => d.collectorId === collector.id && d.status === 'pending');
                  const totalCollected = collectorPayments.reduce((sum, p) => sum + p.amount, 0);
                  const totalPending = collectorDebts.reduce((sum, d) => sum + d.amount, 0);
                  const commissions = totalCollected * (collector.commission / 100);
                  
                  return (
                    <div key={collector.id} style={{ 
                      padding: '12px', 
                      backgroundColor: 'white', 
                      borderRadius: '6px',
                      borderLeft: '3px solid #27ae60'
                    }}>
                      <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>{collector.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Cobrado: {formatCOP(totalCollected)}</span>
                        <span style={{ color: '#27ae60' }}>✓</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Pendiente: {formatCOP(totalPending)}</span>
                        <span style={{ color: '#ef4444' }}>⚠️</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span>Comisión: {formatCOP(commissions)}</span>
                        <span style={{ color: '#f59e0b' }}>💰</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px', 
            width: '90%', 
            maxWidth: '500px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Enviar Ticket por WhatsApp</h3>
              <button 
                onClick={() => setShowWhatsAppModal(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '20px', 
                  cursor: 'pointer' 
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ 
              marginBottom: '20px', 
              padding: '16px', 
              backgroundColor: '#dcfce7', 
              borderRadius: '8px',
              whiteSpace: 'pre-line',
              fontSize: '14px'
            }}>
              {whatsAppMessage}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={openWhatsApp}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#25D366', 
                  color: 'white', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Abrir WhatsApp
              </button>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                style={{ 
                  flex: 1, 
                  backgroundColor: '#e5e7eb', 
                  color: '#1f2937', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;