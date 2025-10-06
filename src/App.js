import React, { useState } from 'react';
import { Users, Package, CreditCard, DollarSign, AlertTriangle, TrendingUp, User, Phone, MapPin, Calendar, CheckCircle, Clock, Plus, Edit2, Trash2, Search, Filter, Download, Save, X, Eye, MessageCircle } from 'lucide-react';

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

  // Calculate installments based on payment frequency
  const calculateInstallments = (amount, frequency) => {
    let totalInstallments = 1;
    
    if (frequency === 'diario') {
      totalInstallments = Math.min(30, Math.ceil(amount / 10000)); // Max 30 days
    } else if (frequency === 'semanal') {
      totalInstallments = Math.min(12, Math.ceil(amount / 50000)); // Max 12 weeks
    } else if (frequency === 'mensual') {
      totalInstallments = Math.min(12, Math.ceil(amount / 100000)); // Max 12 months
    }
    
    return Math.max(1, totalInstallments);
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
      setClients(clients.map(c => 
        c.id === editingClient.id 
          ? { ...editingClient, ...clientFormData, creditLimit: parseFloat(clientFormData.creditLimit) }
          : c
      ));
    } else {
      // Add new client - collectors can only add to themselves
      const newClient = {
        id: clients.length + 1,
        ...clientFormData,
        creditLimit: parseFloat(clientFormData.creditLimit),
        collectorId: getCurrentUserCollectorId(),
        products: clientFormData.products
      };
      setClients([...clients, newClient]);
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
      setClients(clients.filter(c => c.id !== id));
      // Also remove any debts associated with this client
      setDebts(debts.filter(d => d.clientId !== id));
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
      setCollectors(collectors.map(c => 
        c.id === editingCollector.id 
          ? { ...editingCollector, ...collectorFormData, commission: parseFloat(collectorFormData.commission) }
          : c
      ));
    } else {
      // Add new collector
      const newCollector = {
        id: collectors.length + 1,
        ...collectorFormData,
        commission: parseFloat(collectorFormData.commission)
      };
      setCollectors([...collectors, newCollector]);
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
      setCollectors(collectors.filter(c => c.id !== id));
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
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...editingProduct, ...productFormData, price: parseFloat(productFormData.price), commission: parseFloat(productFormData.commission), stock: parseInt(productFormData.stock) }
          : p
      ));
    } else {
      // Add new product
      const newProduct = {
        id: products.length + 1,
        ...productFormData,
        price: parseFloat(productFormData.price),
        commission: parseFloat(productFormData.commission),
        stock: parseInt(productFormData.stock),
        image: productFormData.image || 'https://placehold.co/100x100/27ae60/white?text=🥛'
      };
      setProducts([...products, newProduct]);
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
      setProducts(products.filter(p => p.id !== id));
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
      id: payments.length + 1,
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistema de Gestión y Cobranza</h1>
            <p className="text-gray-600">Distribuidora de Alimentos</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Credenciales de prueba:</h3>
            <div className="text-sm text-blue-700 space-y-1">
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
      { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
      { id: 'payments', label: 'Pagos', icon: CreditCard },
    ];
    
    if (userRole === 'admin') {
      return [
        ...baseItems,
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'clients', label: 'Clientes', icon: Users },
        { id: 'collectors', label: 'Cobradores', icon: User },
        { id: 'reports', label: 'Reportes', icon: Download }
      ];
    } else if (userRole === 'collector') {
      return [
        ...baseItems,
        { id: 'products', label: 'Productos', icon: Package },
        { id: 'clients', label: 'Mis Clientes', icon: Users }
      ];
    }
    return baseItems;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center">
                <Package className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Cobranza</h1>
                <p className="text-sm text-gray-500">Distribuidora de Alimentos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 capitalize">{currentUser}</p>
                <p className="text-xs text-gray-500">{userRole === 'admin' ? 'Administrador' : 'Cobrador'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            {getNavigationItems().map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Cobrado Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCOP(totalCollectedToday)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Pendiente</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCOP(totalPending)}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>

              {userRole === 'collector' && (
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mis Comisiones</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCOP(myCommissions)}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Clientes Morosos</p>
                    <p className="text-2xl font-bold text-gray-900">{delinquentClients.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Delinquent Clients */}
            {delinquentClients.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Clientes Morosos 🚨</h3>
                <div className="space-y-3">
                  {delinquentClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{client.clientName}</p>
                        <p className="text-sm text-red-600">{formatCOP(client.amount)} - {client.daysOverdue} días</p>
                      </div>
                      <Clock className="w-5 h-5 text-red-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products View */}
        {currentView === 'products' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Productos 🥛</h2>
              {userRole === 'admin' && (
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Producto</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentUserProducts.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-16 h-16 rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-lg font-bold text-green-600">{formatCOP(product.price)}</p>
                  <p className="text-sm text-blue-600">Comisión: {product.commission}%</p>
                  {userRole === 'admin' && (
                    <div className="flex space-x-2 mt-3">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Product Form Modal - Admin only */}
            {showProductForm && userRole === 'admin' && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                    </h3>
                    <button onClick={resetProductForm} className="text-gray-500 hover:text-gray-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({...productFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => setProductFormData({...productFormData, category: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Lácteos">Lácteos</option>
                        <option value="Carnes Frías">Carnes Frías</option>
                        <option value="Yogures">Yogures</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precio (COP)</label>
                      <input
                        type="number"
                        value={productFormData.price}
                        onChange={(e) => setProductFormData({...productFormData, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comisión (%)</label>
                      <input
                        type="number"
                        value={productFormData.commission}
                        onChange={(e) => setProductFormData({...productFormData, commission: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        value={productFormData.stock}
                        onChange={(e) => setProductFormData({...productFormData, stock: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen (opcional)</label>
                      <input
                        type="text"
                        value={productFormData.image}
                        onChange={(e) => setProductFormData({...productFormData, image: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingProduct ? 'Actualizar' : 'Guardar'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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

        {/* Clients View */}
        {currentView === 'clients' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {userRole === 'admin' ? 'Clientes 👥' : 'Mis Clientes 👥'}
              </h2>
              {userRole === 'collector' && (
                <button 
                  onClick={() => {
                    setEditingClient(null);
                    setShowClientForm(true);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Cliente</span>
                </button>
              )}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Cliente</th>
                    <th className="text-left py-3">Teléfono</th>
                    <th className="text-left py-3">Dirección</th>
                    <th className="text-left py-3">Límite Crédito</th>
                    <th className="text-left py-3">Frecuencia</th>
                    <th className="text-left py-3">Productos</th>
                    {userRole === 'admin' && <th className="text-left py-3">Cobrador</th>}
                    <th className="text-left py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUserClients.map((client) => (
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">{client.name}</td>
                      <td className="py-3">{client.phone}</td>
                      <td className="py-3">{client.address}</td>
                      <td className="py-3">{formatCOP(client.creditLimit)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          client.paymentFrequency === 'diario' ? 'bg-blue-100 text-blue-800' :
                          client.paymentFrequency === 'semanal' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {client.paymentFrequency === 'diario' ? 'Diario' : 
                           client.paymentFrequency === 'semanal' ? 'Semanal' : 'Mensual'}
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        {getProductNamesByIds(client.products || []).substring(0, 30)}
                        {getProductNamesByIds(client.products || []).length > 30 ? '...' : ''}
                      </td>
                      {userRole === 'admin' && (
                        <td className="py-3">
                          {collectors.find(c => c.id === client.collectorId)?.name || 'Sin asignar'}
                        </td>
                      )}
                      <td className="py-3">
                        <div className="flex space-x-2">
                          {userRole === 'collector' && (
                            <>
                              <button 
                                onClick={() => handleEditClient(client)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClient(client.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {userRole === 'admin' && (
                            <button className="text-gray-400 cursor-not-allowed">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Client Form Modal - Collectors only */}
            {showClientForm && userRole === 'collector' && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h3>
                    <button onClick={resetClientForm} className="text-gray-500 hover:text-gray-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleClientSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre/Razón Social</label>
                      <input
                        type="text"
                        value={clientFormData.name}
                        onChange={(e) => setClientFormData({...clientFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={clientFormData.phone}
                        onChange={(e) => setClientFormData({...clientFormData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="310-123-4567"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                      <input
                        type="text"
                        value={clientFormData.address}
                        onChange={(e) => setClientFormData({...clientFormData, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Crédito (COP)</label>
                      <input
                        type="number"
                        value={clientFormData.creditLimit}
                        onChange={(e) => setClientFormData({...clientFormData, creditLimit: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frecuencia de Pago</label>
                      <select
                        value={clientFormData.paymentFrequency}
                        onChange={(e) => setClientFormData({...clientFormData, paymentFrequency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="diario">Diario</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Productos que vende</label>
                      <div className="border rounded-lg p-3 max-h-40 overflow-y-auto">
                        {products.map(product => (
                          <div key={product.id} className="flex items-center space-x-2 py-1">
                            <input
                              type="checkbox"
                              id={`product-${product.id}`}
                              checked={clientFormData.products.includes(product.id)}
                              onChange={() => toggleProductSelection(product.id)}
                              className="rounded"
                            />
                            <label htmlFor={`product-${product.id}`} className="text-sm flex-1">
                              {product.name} - {formatCOP(product.price)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingClient ? 'Actualizar' : 'Guardar'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetClientForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Gestión de Cobradores 🚴</h2>
              <button 
                onClick={() => setShowCollectorForm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Cobrador</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collectors.map((collector) => (
                <div key={collector.id} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                      <User className="text-blue-600 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{collector.name}</h3>
                      <p className="text-sm text-blue-600">{collector.commission}% comisión</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{collector.phone}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <button 
                      onClick={() => handleEditCollector(collector)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCollector(collector.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Collector Form Modal */}
            {showCollectorForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingCollector ? 'Editar Cobrador' : 'Nuevo Cobrador'}
                    </h3>
                    <button onClick={resetCollectorForm} className="text-gray-500 hover:text-gray-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleCollectorSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={collectorFormData.name}
                        onChange={(e) => setCollectorFormData({...collectorFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                      <input
                        type="text"
                        value={collectorFormData.phone}
                        onChange={(e) => setCollectorFormData({...collectorFormData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="310-123-4567"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Porcentaje de Comisión (%)</label>
                      <input
                        type="number"
                        value={collectorFormData.commission}
                        onChange={(e) => setCollectorFormData({...collectorFormData, commission: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingCollector ? 'Actualizar' : 'Guardar'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetCollectorForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Registro de Pagos 💳</h2>
            
            <div className="space-y-4">
              {currentUserDebts.map((debt) => (
                <div key={debt.id} className="border rounded-lg p-4 hover:shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {clients.find(c => c.id === debt.clientId)?.name || 'Cliente desconocido'}
                      </h3>
                      <p className="text-red-600 font-medium">{formatCOP(debt.amount)}</p>
                      <p className="text-sm text-gray-600">Atrasado: {debt.daysOverdue} días</p>
                      <p className="text-sm text-blue-600">
                        Cuotas: {debt.paidInstallments} de {debt.totalInstallments}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleRegisterPayment(debt)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Registrar Pago</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Form Modal */}
            {showPaymentForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Registrar Pago</h3>
                    <button onClick={resetPaymentForm} className="text-gray-500 hover:text-gray-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      Cliente: {clients.find(c => c.id === selectedDebt?.clientId)?.name}
                    </p>
                    <p className="text-red-600">Monto adeudado: {formatCOP(selectedDebt?.amount || 0)}</p>
                    <p className="text-blue-600">
                      Cuotas: {selectedDebt?.paidInstallments || 0} de {selectedDebt?.totalInstallments || 1}
                    </p>
                  </div>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Monto a pagar (COP)</label>
                      <input
                        type="number"
                        value={paymentFormData.amount}
                        onChange={(e) => setPaymentFormData({...paymentFormData, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        required
                        min="1"
                        max={selectedDebt?.amount}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                      <select
                        value={paymentFormData.paymentMethod}
                        onChange={(e) => setPaymentFormData({...paymentFormData, paymentMethod: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="efectivo">Efectivo</option>
                        <option value="transferencia">Transferencia</option>
                        <option value="tarjeta">Tarjeta</option>
                      </select>
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Registrar Pago</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetPaymentForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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

        {currentView === 'reports' && userRole === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Reportes 📈</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Reporte de Cobranza Diaria</h3>
                  <div className="space-y-3">
                    {collectors.map((collector) => {
                      const collectorPayments = payments.filter(p => p.collectorId === collector.id);
                      const collectorDebts = debts.filter(d => d.collectorId === collector.id && d.status === 'pending');
                      const totalCollected = collectorPayments.reduce((sum, p) => sum + p.amount, 0);
                      const totalPending = collectorDebts.reduce((sum, d) => sum + d.amount, 0);
                      const commissions = totalCollected * (collector.commission / 100);
                      
                      return (
                        <div key={collector.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">{collector.name}</span>
                          <div className="text-right">
                            <p className="text-green-600 font-medium">{formatCOP(totalCollected)}</p>
                            <p className="text-sm text-gray-600">Pendiente: {formatCOP(totalPending)}</p>
                            <p className="text-sm text-blue-600">Comisión: {formatCOP(commissions)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Resumen General</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-green-50 rounded">
                      <span>Total Cobrado</span>
                      <span className="text-green-600">{formatCOP(payments.reduce((sum, p) => sum + p.amount, 0))}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-red-50 rounded">
                      <span>Total Pendiente</span>
                      <span className="text-red-600">{formatCOP(debts.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.amount, 0))}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded">
                      <span>Total Clientes</span>
                      <span className="text-blue-600">{clients.length}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-purple-50 rounded">
                      <span>Total Cobradores</span>
                      <span className="text-purple-600">{collectors.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enviar Ticket por WhatsApp</h3>
              <button 
                onClick={() => setShowWhatsAppModal(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm whitespace-pre-line">{whatsAppMessage}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={openWhatsApp}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp</span>
              </button>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
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