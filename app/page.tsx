"use client";

import { useMemo, useState } from "react";

type Screen =
  | "login"
  | "dashboard"
  | "stock"
  | "product-view"
  | "product-edit"
  | "product-new"
  | "low-stock"
  | "orders"
  | "order-detail"
  | "order-status"
  | "notifications"
  | "confirmation";

type Product = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minimum: number;
  supplier: string;
  sku: string;
  cost: string;
  description: string;
};

type OrderStatus = "processando" | "enviado" | "entregue";

type Order = {
  id: string;
  client: string;
  date: string;
  status: OrderStatus;
  address: string;
  items: Array<{ productId: number; quantity: number }>;
};

type NotificationSettings = {
  inApp: boolean;
  push: boolean;
  email: boolean;
  daily: boolean;
  threshold: number;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Ecobag algodao organico",
    category: "Bolsas",
    quantity: 8,
    minimum: 10,
    supplier: "Cooperativa Verde",
    sku: "ECO-BAG-001",
    cost: "R$ 18,90",
    description: "Sacola reutilizavel de algodao organico para compras e feiras.",
  },
  {
    id: 2,
    name: "Garrafa inox reutilizavel",
    category: "Utilidades",
    quantity: 4,
    minimum: 12,
    supplier: "Inox Sustentavel",
    sku: "GAR-INOX-020",
    cost: "R$ 42,00",
    description: "Garrafa termica reutilizavel, livre de plastico descartavel.",
  },
  {
    id: 3,
    name: "Canudo de bambu",
    category: "Cozinha",
    quantity: 35,
    minimum: 15,
    supplier: "Bambu Brasil",
    sku: "CAN-BAM-033",
    cost: "R$ 5,90",
    description: "Canudo reutilizavel de bambu com embalagem de tecido reciclado.",
  },
  {
    id: 4,
    name: "Sabonete natural vegano",
    category: "Higiene",
    quantity: 21,
    minimum: 20,
    supplier: "Aroma Natural",
    sku: "SAB-VEG-014",
    cost: "R$ 9,50",
    description: "Sabonete artesanal vegano, sem testes em animais.",
  },
];

const initialOrders: Order[] = [
  {
    id: "#1023",
    client: "Ana Silva",
    date: "2026-05-02",
    status: "processando",
    address: "Rua das Flores, 120 - Sao Paulo/SP",
    items: [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 5 },
    ],
  },
  {
    id: "#1024",
    client: "Joao Lima",
    date: "2026-05-03",
    status: "processando",
    address: "Av. Brasil, 900 - Campinas/SP",
    items: [
      { productId: 2, quantity: 5 },
      { productId: 4, quantity: 3 },
    ],
  },
  {
    id: "#1025",
    client: "Carla Souza",
    date: "2026-05-04",
    status: "enviado",
    address: "Rua Verde, 55 - Curitiba/PR",
    items: [
      { productId: 1, quantity: 1 },
      { productId: 4, quantity: 6 },
    ],
  },
  {
    id: "#1026",
    client: "Mercado Aurora",
    date: "2026-05-05",
    status: "entregue",
    address: "Praca Central, 88 - Santos/SP",
    items: [{ productId: 3, quantity: 12 }],
  },
];

const menuItems: Array<{ screen: Screen; label: string; icon: string }> = [
  { screen: "dashboard", label: "Inicio", icon: "⌂" },
  { screen: "stock", label: "Estoque", icon: "▦" },
  { screen: "orders", label: "Pedidos", icon: "☑" },
  { screen: "notifications", label: "Notificacoes", icon: "🔔" },
];

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function statusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    processando: "Processando",
    enviado: "Enviado",
    entregue: "Entregue",
  };
  return labels[status];
}

function stockStatus(product: Product) {
  if (product.quantity <= product.minimum / 2) return { label: "Critico", className: "danger" };
  if (product.quantity < product.minimum) return { label: "Baixo", className: "warning" };
  return { label: "Normal", className: "success" };
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("login");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("#1023");
  const [orderSort, setOrderSort] = useState<"client" | "date" | "status">("date");
  const [confirmation, setConfirmation] = useState({
    title: "Alteracao concluida",
    message: "A operacao foi registrada com seguranca.",
  });
  const [settings, setSettings] = useState<NotificationSettings>({
    inApp: true,
    push: true,
    email: false,
    daily: true,
    threshold: 10,
  });

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];
  const lowStockProducts = products.filter((product) => product.quantity < product.minimum);

  function go(screenName: Screen) {
    setScreen(screenName);
  }

  function selectProduct(productId: number, nextScreen: Screen) {
    setSelectedProductId(productId);
    setScreen(nextScreen);
  }

  function selectOrder(orderId: string, nextScreen: Screen) {
    setSelectedOrderId(orderId);
    setScreen(nextScreen);
  }

  function showConfirmation(title: string, message: string) {
    setConfirmation({ title, message });
    setScreen("confirmation");
  }

  function updateProduct(updatedProduct: Product) {
    setProducts((current) =>
      current.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
    );
    showConfirmation(
      "Estoque atualizado com sucesso",
      "A alteracao foi registrada com data, usuario responsavel e validacao dos campos obrigatorios.",
    );
  }

  function createProduct(newProduct: Product) {
    setProducts((current) => [...current, newProduct]);
    setSelectedProductId(newProduct.id);
    showConfirmation("Produto cadastrado", "O novo item sustentavel foi incluido na tabela de estoque.");
  }

  function updateOrderStatus(status: OrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === selectedOrder.id ? { ...order, status } : order)),
    );
    showConfirmation(
      "Status do pedido atualizado",
      `O pedido ${selectedOrder.id} agora esta marcado como ${statusLabel(status).toLowerCase()}.`,
    );
  }

  if (screen === "login") {
    return <LoginScreen onLogin={() => go("dashboard")} />;
  }

  return (
    <main className="page-shell">
      <section className="tablet-frame" aria-label="Wireframe para Tablet Android 13">
        <div className="android-status-bar">
          <span>Tablet Android 13</span>
          <span>10:42 · Wi-Fi · 92%</span>
        </div>

        <div className="app-layout">
          <Sidebar current={screen} onNavigate={go} />
          <section className="content-area">
            <TopBar screen={screen} onNavigate={go} lowStockCount={lowStockProducts.length} />

            {screen === "dashboard" && (
              <DashboardScreen
                products={products}
                orders={orders}
                lowStockProducts={lowStockProducts}
                onNavigate={go}
                onSelectOrder={selectOrder}
              />
            )}

            {screen === "stock" && (
              <StockScreen products={products} onSelectProduct={selectProduct} onNavigate={go} />
            )}

            {screen === "product-view" && (
              <ProductViewScreen product={selectedProduct} onNavigate={go} onEdit={() => go("product-edit")} />
            )}

            {screen === "product-edit" && (
              <ProductEditScreen product={selectedProduct} onSave={updateProduct} onCancel={() => go("stock")} />
            )}

            {screen === "product-new" && (
              <ProductNewScreen products={products} onCreate={createProduct} onCancel={() => go("stock")} />
            )}

            {screen === "low-stock" && (
              <LowStockScreen products={lowStockProducts} onSelectProduct={selectProduct} onNavigate={go} />
            )}

            {screen === "orders" && (
              <OrdersScreen
                orders={orders}
                products={products}
                sortBy={orderSort}
                setSortBy={setOrderSort}
                onSelectOrder={selectOrder}
              />
            )}

            {screen === "order-detail" && (
              <OrderDetailScreen
                order={selectedOrder}
                products={products}
                onNavigate={go}
                onUpdateStatus={() => go("order-status")}
              />
            )}

            {screen === "order-status" && (
              <OrderStatusScreen order={selectedOrder} onSave={updateOrderStatus} onCancel={() => go("order-detail")} />
            )}

            {screen === "notifications" && (
              <NotificationsScreen
                settings={settings}
                setSettings={setSettings}
                onSave={() =>
                  showConfirmation(
                    "Configuracoes salvas",
                    "O app enviara alertas no tablet quando o estoque atingir o limite configurado.",
                  )
                }
              />
            )}

            {screen === "confirmation" && (
              <ConfirmationScreen title={confirmation.title} message={confirmation.message} onBack={() => go("dashboard")} />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">♻</div>
        <p className="eyebrow">Wireframe · Tablet Android 13</p>
        <h1 id="login-title">EcoGestor</h1>
        <p className="muted">Acesso seguro ao estoque, pedidos e alertas da loja sustentavel.</p>

        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" defaultValue="gestor@lojaeco.com" aria-describedby="login-help" />

        <label htmlFor="password">Senha</label>
        <input id="password" type="password" defaultValue="12345678" />

        <div className="login-options">
          <label className="inline-check">
            <input type="checkbox" defaultChecked /> Manter conectado
          </label>
          <button type="button" className="link-button">Esqueci minha senha</button>
        </div>

        <button className="primary full" onClick={onLogin}>Entrar</button>
        <p id="login-help" className="security-note">Senha mascarada, recuperacao de acesso e bloqueio de dados sem autenticacao.</p>
      </section>
    </main>
  );
}

function Sidebar({ current, onNavigate }: { current: Screen; onNavigate: (screen: Screen) => void }) {
  return (
    <aside className="sidebar" aria-label="Navegacao principal">
      <div className="sidebar-brand">
        <span className="brand-icon">♻</span>
        <div>
          <strong>EcoGestor</strong>
          <small>Loja sustentavel</small>
        </div>
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.screen}
            type="button"
            className={current === item.screen ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate(item.screen)}
            aria-current={current === item.screen ? "page" : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <button type="button" className="nav-item exit" onClick={() => onNavigate("login")}>
        <span aria-hidden="true">⎋</span>
        Sair
      </button>
    </aside>
  );
}

function TopBar({
  screen,
  onNavigate,
  lowStockCount,
}: {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
  lowStockCount: number;
}) {
  const titles: Partial<Record<Screen, string>> = {
    dashboard: "Tela inicial",
    stock: "Gestao de estoque",
    "product-view": "Visualizar produto",
    "product-edit": "Editar produto",
    "product-new": "Novo produto",
    "low-stock": "Alerta de estoque baixo",
    orders: "Gestao de pedidos",
    "order-detail": "Detalhes do pedido",
    "order-status": "Atualizar status",
    notifications: "Configuracoes de notificacoes",
    confirmation: "Confirmacao",
  };

  return (
    <header className="top-bar">
      <div>
        <p className="eyebrow">Modulo atual</p>
        <h2>{titles[screen] ?? "EcoGestor"}</h2>
      </div>
      <div className="top-actions">
        <button type="button" className="ghost" onClick={() => window.print()}>Exportar PDF</button>
        <button type="button" className="notification-button" onClick={() => onNavigate("low-stock")} aria-label="Abrir alertas de estoque baixo">
          🔔 <span>{lowStockCount}</span>
        </button>
      </div>
    </header>
  );
}

function DashboardScreen({
  products,
  orders,
  lowStockProducts,
  onNavigate,
  onSelectOrder,
}: {
  products: Product[];
  orders: Order[];
  lowStockProducts: Product[];
  onNavigate: (screen: Screen) => void;
  onSelectOrder: (id: string, screen: Screen) => void;
}) {
  const pendingOrders = orders.filter((order) => order.status === "processando");
  const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);

  return (
    <div className="screen-stack">
      <section className="summary-grid" aria-label="Resumo geral">
        <MetricCard label="Produtos cadastrados" value={String(products.length)} helper={`${totalItems} unidades em estoque`} />
        <MetricCard label="Estoque baixo" value={String(lowStockProducts.length)} helper="Itens que precisam de reposicao" tone="warning" />
        <MetricCard label="Pedidos pendentes" value={String(pendingOrders.length)} helper="Aguardando processamento" />
      </section>

      <section className="two-columns">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Alertas importantes</p>
              <h3>Estoque baixo</h3>
            </div>
            <button type="button" className="secondary" onClick={() => onNavigate("low-stock")}>Ver alertas</button>
          </div>

          <div className="card-list">
            {lowStockProducts.map((product) => {
              const status = stockStatus(product);
              return (
                <button key={product.id} className="list-card" onClick={() => onNavigate("low-stock")}>
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.quantity} unidades · minimo {product.minimum}</small>
                  </span>
                  <Badge label={status.label} tone={status.className} />
                </button>
              );
            })}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Pedidos recentes</p>
              <h3>Pendentes e em andamento</h3>
            </div>
            <button type="button" className="secondary" onClick={() => onNavigate("orders")}>Ver pedidos</button>
          </div>

          <div className="card-list">
            {orders.slice(0, 3).map((order) => (
              <button key={order.id} className="list-card" onClick={() => onSelectOrder(order.id, "order-detail")}>
                <span>
                  <strong>{order.id} · {order.client}</strong>
                  <small>{formatDate(order.date)}</small>
                </span>
                <Badge label={statusLabel(order.status)} tone={order.status === "entregue" ? "success" : "info"} />
              </button>
            ))}
          </div>
        </article>
      </section>

      <FlowHint />
    </div>
  );
}

function MetricCard({ label, value, helper, tone = "info" }: { label: string; value: string; helper: string; tone?: "info" | "warning" }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </article>
  );
}

function StockScreen({
  products,
  onSelectProduct,
  onNavigate,
}: {
  products: Product[];
  onSelectProduct: (id: number, screen: Screen) => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <div className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Modulo Gestao Estoque</p>
            <h3>Tabela de produtos</h3>
          </div>
          <button type="button" className="primary" onClick={() => onNavigate("product-new")}>+ Novo produto</button>
        </div>

        <div className="filters">
          <label>
            Buscar produto
            <input type="search" placeholder="Ex.: ecobag" />
          </label>
          <label>
            Categoria
            <select defaultValue="todas">
              <option value="todas">Todas</option>
              <option value="bolsas">Bolsas</option>
              <option value="cozinha">Cozinha</option>
              <option value="higiene">Higiene</option>
            </select>
          </label>
          <label>
            Status
            <select defaultValue="todos">
              <option value="todos">Todos</option>
              <option value="normal">Normal</option>
              <option value="baixo">Baixo</option>
              <option value="critico">Critico</option>
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Quantidade</th>
                <th>Estoque minimo</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = stockStatus(product);
                return (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <small>{product.sku}</small>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>{product.minimum}</td>
                    <td><Badge label={status.label} tone={status.className} /></td>
                    <td>
                      <div className="row-actions" aria-label={`Acoes do produto ${product.name}`}>
                        <button type="button" onClick={() => onSelectProduct(product.id, "product-view")} aria-label="Visualizar produto">👁 Ver</button>
                        <button type="button" onClick={() => onSelectProduct(product.id, "product-edit")} aria-label="Editar produto">✎ Editar</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Annotation title="Legenda dos icones" text="👁 visualizar produto · ✎ editar quantidade e dados · + inserir novo produto." />
    </div>
  );
}

function ProductViewScreen({ product, onNavigate, onEdit }: { product: Product; onNavigate: (screen: Screen) => void; onEdit: () => void }) {
  const status = stockStatus(product);
  return (
    <div className="screen-stack">
      <section className="panel detail-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Consulta rapida</p>
            <h3>{product.name}</h3>
          </div>
          <Badge label={status.label} tone={status.className} />
        </div>

        <dl className="detail-grid">
          <div><dt>Categoria</dt><dd>{product.category}</dd></div>
          <div><dt>SKU</dt><dd>{product.sku}</dd></div>
          <div><dt>Quantidade atual</dt><dd>{product.quantity} unidades</dd></div>
          <div><dt>Estoque minimo</dt><dd>{product.minimum} unidades</dd></div>
          <div><dt>Fornecedor</dt><dd>{product.supplier}</dd></div>
          <div><dt>Custo</dt><dd>{product.cost}</dd></div>
        </dl>

        <p className="description-box">{product.description}</p>

        <div className="action-bar">
          <button type="button" className="secondary" onClick={() => onNavigate("stock")}>Voltar</button>
          <button type="button" className="primary" onClick={onEdit}>Editar produto</button>
        </div>
      </section>
    </div>
  );
}

function ProductEditScreen({ product, onSave, onCancel }: { product: Product; onSave: (product: Product) => void; onCancel: () => void }) {
  const [form, setForm] = useState(product);

  return (
    <ProductForm
      title="Editar produto e ajustar quantidade"
      subtitle="Alteracoes importantes exigem confirmacao antes de salvar."
      product={form}
      setProduct={setForm}
      onSubmit={() => onSave(form)}
      onCancel={onCancel}
      submitLabel="Salvar alteracoes"
    />
  );
}

function ProductNewScreen({
  products,
  onCreate,
  onCancel,
}: {
  products: Product[];
  onCreate: (product: Product) => void;
  onCancel: () => void;
}) {
  const nextId = Math.max(...products.map((product) => product.id)) + 1;
  const [form, setForm] = useState<Product>({
    id: nextId,
    name: "Produto sustentavel novo",
    category: "Utilidades",
    quantity: 10,
    minimum: 8,
    supplier: "Fornecedor responsavel",
    sku: `ECO-NOVO-${String(nextId).padStart(3, "0")}`,
    cost: "R$ 0,00",
    description: "Descricao breve do produto, origem sustentavel e uso principal.",
  });

  return (
    <ProductForm
      title="Cadastrar novo produto"
      subtitle="Campos obrigatorios: nome, quantidade inicial e estoque minimo."
      product={form}
      setProduct={setForm}
      onSubmit={() => onCreate(form)}
      onCancel={onCancel}
      submitLabel="Cadastrar produto"
    />
  );
}

function ProductForm({
  title,
  subtitle,
  product,
  setProduct,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  title: string;
  subtitle: string;
  product: Product;
  setProduct: (product: Product) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Formulario de estoque</p>
            <h3>{title}</h3>
            <p className="muted">{subtitle}</p>
          </div>
        </div>

        <form className="form-grid" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
          <label>
            Nome do produto
            <input value={product.name} required onChange={(event) => setProduct({ ...product, name: event.target.value })} />
          </label>
          <label>
            Categoria
            <input value={product.category} onChange={(event) => setProduct({ ...product, category: event.target.value })} />
          </label>
          <label>
            Quantidade
            <input type="number" min="0" value={product.quantity} required onChange={(event) => setProduct({ ...product, quantity: Number(event.target.value) })} />
          </label>
          <label>
            Estoque minimo
            <input type="number" min="0" value={product.minimum} required onChange={(event) => setProduct({ ...product, minimum: Number(event.target.value) })} />
          </label>
          <label>
            Fornecedor
            <input value={product.supplier} onChange={(event) => setProduct({ ...product, supplier: event.target.value })} />
          </label>
          <label>
            Custo
            <input value={product.cost} onChange={(event) => setProduct({ ...product, cost: event.target.value })} />
          </label>
          <label>
            Codigo/SKU
            <input value={product.sku} onChange={(event) => setProduct({ ...product, sku: event.target.value })} />
          </label>
          <label className="span-2">
            Descricao
            <textarea value={product.description} onChange={(event) => setProduct({ ...product, description: event.target.value })} />
          </label>

          <div className="form-footer span-2">
            <p className="security-note">Seguranca: alteracoes de estoque devem ficar vinculadas ao usuario autenticado.</p>
            <div className="action-bar compact">
              <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
              <button type="submit" className="primary">{submitLabel}</button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function LowStockScreen({
  products,
  onSelectProduct,
  onNavigate,
}: {
  products: Product[];
  onSelectProduct: (id: number, screen: Screen) => void;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <div className="screen-stack">
      <section className="alert-panel" role="alert" aria-labelledby="low-stock-title">
        <div>
          <p className="eyebrow">Notificacao imediata</p>
          <h3 id="low-stock-title">Alerta de estoque baixo</h3>
          <p>Os produtos abaixo estao abaixo do estoque minimo. Reponha ou atualize a quantidade para evitar falta.</p>
        </div>
        <button type="button" className="primary" onClick={() => onNavigate("notifications")}>Configurar alertas</button>
      </section>

      <section className="panel">
        <div className="card-list">
          {products.length === 0 ? (
            <p className="muted">Nenhum produto em estoque baixo no momento.</p>
          ) : (
            products.map((product) => (
              <article key={product.id} className="stock-alert-card">
                <div>
                  <strong>{product.name}</strong>
                  <p>Quantidade atual: {product.quantity} · minimo recomendado: {product.minimum}</p>
                </div>
                <div className="action-bar compact">
                  <button type="button" className="secondary" onClick={() => onSelectProduct(product.id, "product-view")}>Ver produto</button>
                  <button type="button" className="primary" onClick={() => onSelectProduct(product.id, "product-edit")}>Atualizar estoque</button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function OrdersScreen({
  orders,
  products,
  sortBy,
  setSortBy,
  onSelectOrder,
}: {
  orders: Order[];
  products: Product[];
  sortBy: "client" | "date" | "status";
  setSortBy: (sortBy: "client" | "date" | "status") => void;
  onSelectOrder: (id: string, screen: Screen) => void;
}) {
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => String(a[sortBy]).localeCompare(String(b[sortBy])));
  }, [orders, sortBy]);

  function orderAvailability(order: Order) {
    return order.items.every((item) => {
      const product = products.find((current) => current.id === item.productId);
      return product ? product.quantity >= item.quantity : false;
    });
  }

  return (
    <div className="screen-stack">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Modulo Gestao de Pedidos</p>
            <h3>Lista de pedidos recebidos</h3>
          </div>
          <label className="sort-control">
            Ordenar por
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as "client" | "date" | "status")}>
              <option value="client">Cliente</option>
              <option value="date">Data de solicitacao</option>
              <option value="status">Status do pedido</option>
            </select>
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Status</th>
                <th>Disponibilidade</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.client}</td>
                  <td>{formatDate(order.date)}</td>
                  <td><Badge label={statusLabel(order.status)} tone={order.status === "entregue" ? "success" : "info"} /></td>
                  <td>{orderAvailability(order) ? <Badge label="Disponivel" tone="success" /> : <Badge label="Conferir" tone="warning" />}</td>
                  <td>
                    <button type="button" className="secondary small" onClick={() => onSelectOrder(order.id, "order-detail")}>Ver pedido</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function OrderDetailScreen({
  order,
  products,
  onNavigate,
  onUpdateStatus,
}: {
  order: Order;
  products: Product[];
  onNavigate: (screen: Screen) => void;
  onUpdateStatus: () => void;
}) {
  const items = order.items.map((item) => {
    const product = products.find((current) => current.id === item.productId);
    return {
      ...item,
      product,
      available: product ? product.quantity >= item.quantity : false,
    };
  });

  return (
    <div className="screen-stack">
      <section className="panel detail-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Detalhes do pedido</p>
            <h3>{order.id} · {order.client}</h3>
          </div>
          <Badge label={statusLabel(order.status)} tone={order.status === "entregue" ? "success" : "info"} />
        </div>

        <dl className="detail-grid">
          <div><dt>Cliente</dt><dd>{order.client}</dd></div>
          <div><dt>Data de solicitacao</dt><dd>{formatDate(order.date)}</dd></div>
          <div><dt>Status atual</dt><dd>{statusLabel(order.status)}</dd></div>
          <div><dt>Endereco</dt><dd>{order.address}</dd></div>
        </dl>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Solicitado</th>
                <th>Em estoque</th>
                <th>Disponivel?</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${order.id}-${item.productId}`}>
                  <td>{item.product?.name ?? "Produto nao encontrado"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.product?.quantity ?? 0}</td>
                  <td>{item.available ? <Badge label="Sim" tone="success" /> : <Badge label="Nao" tone="danger" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="action-bar">
          <button type="button" className="secondary" onClick={() => onNavigate("orders")}>Voltar</button>
          <button type="button" className="secondary" onClick={() => onNavigate("stock")}>Conferir estoque</button>
          <button type="button" className="primary" onClick={onUpdateStatus}>Atualizar status</button>
        </div>
      </section>
    </div>
  );
}

function OrderStatusScreen({ order, onSave, onCancel }: { order: Order; onSave: (status: OrderStatus) => void; onCancel: () => void }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const statuses: OrderStatus[] = ["processando", "enviado", "entregue"];

  return (
    <div className="screen-stack">
      <section className="panel narrow-panel">
        <p className="eyebrow">Pedido {order.id}</p>
        <h3>Atualizar status do pedido</h3>
        <p className="muted">Escolha um dos status permitidos: processando, enviado ou entregue.</p>

        <fieldset className="radio-group">
          <legend>Status</legend>
          {statuses.map((item) => (
            <label key={item}>
              <input type="radio" name="status" checked={status === item} onChange={() => setStatus(item)} />
              {statusLabel(item)}
            </label>
          ))}
        </fieldset>

        <div className="action-bar">
          <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
          <button type="button" className="primary" onClick={() => onSave(status)}>Salvar status</button>
        </div>
      </section>
    </div>
  );
}

function NotificationsScreen({
  settings,
  setSettings,
  onSave,
}: {
  settings: NotificationSettings;
  setSettings: (settings: NotificationSettings) => void;
  onSave: () => void;
}) {
  function toggle(key: keyof NotificationSettings) {
    if (typeof settings[key] === "boolean") {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  }

  return (
    <div className="screen-stack">
      <section className="panel narrow-panel">
        <p className="eyebrow">Modulo Notificacoes</p>
        <h3>Configuracao para alertas no dispositivo movel</h3>
        <p className="muted">O cliente pode escolher mais de uma forma de notificacao para agir rapidamente.</p>

        <div className="toggle-list">
          <Toggle label="Alerta dentro do app" description="Exibe aviso imediato na tela inicial." checked={settings.inApp} onClick={() => toggle("inApp")} />
          <Toggle label="Notificacao push no tablet" description="Envia alerta no Android quando o estoque fica baixo." checked={settings.push} onClick={() => toggle("push")} />
          <Toggle label="Alerta por e-mail" description="Envia copia do aviso para o e-mail cadastrado." checked={settings.email} onClick={() => toggle("email")} />
          <Toggle label="Resumo diario" description="Mostra produtos criticos no inicio do dia." checked={settings.daily} onClick={() => toggle("daily")} />
        </div>

        <label className="threshold-control">
          Avisar quando o estoque ficar abaixo de
          <input
            type="number"
            min="1"
            value={settings.threshold}
            onChange={(event) => setSettings({ ...settings, threshold: Number(event.target.value) })}
          />
          unidades
        </label>

        <div className="action-bar">
          <button type="button" className="primary" onClick={onSave}>Salvar configuracoes</button>
        </div>
      </section>

      <Annotation title="Clareza das notificacoes" text="Alertas usam texto objetivo, prioridade visual e acao direta para atualizar o estoque." />
    </div>
  );
}

function ConfirmationScreen({ title, message, onBack }: { title: string; message: string; onBack: () => void }) {
  return (
    <div className="screen-stack center-content">
      <section className="confirmation-card" role="status">
        <div className="success-icon" aria-hidden="true">✓</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <button type="button" className="primary" onClick={onBack}>Voltar para tela inicial</button>
      </section>
    </div>
  );
}

function Toggle({ label, description, checked, onClick }: { label: string; description: string; checked: boolean; onClick: () => void }) {
  return (
    <button type="button" className="toggle-row" onClick={onClick} aria-pressed={checked}>
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span className={checked ? "switch on" : "switch"} aria-hidden="true"><span /></span>
    </button>
  );
}

function Badge({ label, tone }: { label: string; tone: string }) {
  return <span className={`badge ${tone}`}>{label}</span>;
}

function Annotation({ title, text }: { title: string; text: string }) {
  return (
    <aside className="annotation">
      <strong>{title}</strong>
      <p>{text}</p>
    </aside>
  );
}

function FlowHint() {
  return (
    <section className="flow-hint" aria-label="Fluxo de navegacao">
      <strong>Fluxo principal:</strong>
      <span>Login</span>
      <span aria-hidden="true">→</span>
      <span>Inicio</span>
      <span aria-hidden="true">→</span>
      <span>Estoque / Pedidos / Notificacoes</span>
      <span aria-hidden="true">→</span>
      <span>Confirmacao</span>
    </section>
  );
}
