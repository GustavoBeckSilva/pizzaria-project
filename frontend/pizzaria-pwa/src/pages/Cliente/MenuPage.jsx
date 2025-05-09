import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tamanhosService from '../../services/tamanhos';
import * as saboresService from '../../services/sabores';
import { CarrinhoContext } from '../../context/CarrinhoContext';
import Button from '../../components/Button';
import {
  PRECO_POR_TAMANHO,
  MAX_SABORES_POR_TAMANHO,
} from '../../utils/constantes';
import { formatarPreco } from '../../utils/formatadores';

export default function MenuPage() {
  const [tamanhos, setTamanhos] = useState([]);
  const [sabores, setSabores] = useState([]);
  const [form, setForm] = useState({
    tamanho: '',
    sabores: [],
    quantidade: 1,
  });
  const [alerta, setAlerta] = useState(null);
  const { adicionarPizza } = useContext(CarrinhoContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setTamanhos(await tamanhosService.getAll());
        setSabores(await saboresService.getAll());
      } catch (err) {
        mostrarAlerta('danger', 'Erro ao carregar tamanhos ou sabores');
      }
    })();
  }, []);

  function mostrarAlerta(tipo, mensagem) {
    setAlerta({ tipo, mensagem });
    setTimeout(() => setAlerta(null), 3000);
  }

  function toggleSabor(id) {
    if (!form.tamanho) return;
    const max = MAX_SABORES_POR_TAMANHO[form.tamanho] || 0;
    const has = form.sabores.includes(id);
    if (!has && form.sabores.length >= max) {
      mostrarAlerta('danger', `Máximo de ${max} sabor${max > 1 ? 'es' : ''}`);
      return;
    }
    setForm((f) => ({
      ...f,
      sabores: has
        ? f.sabores.filter((s) => s !== id)
        : [...f.sabores, id],
    }));
  }

  function handleQuantidade(e) {
    const qtd = parseInt(e.target.value, 10);
    if (isNaN(qtd) || qtd < 1) {
      mostrarAlerta('danger', 'Quantidade mínima é 1');
      return;
    }
    setForm((f) => ({ ...f, quantidade: qtd }));
  }

  function handleAdd() {
    if (!form.tamanho) {
      mostrarAlerta('danger', 'Selecione um tamanho');
      return;
    }
    if (form.sabores.length === 0) {
      mostrarAlerta('danger', 'Selecione ao menos um sabor');
      return;
    }
    const precoUnit = PRECO_POR_TAMANHO[form.tamanho];
    adicionarPizza({ ...form, precoUnit });
    mostrarAlerta('success', 'Pizza adicionada ao carrinho');
    setTimeout(() => navigate('/cliente/carrinho'), 1500);
    setForm({ tamanho: '', sabores: [], quantidade: 1 });
  }

  return (
    <div className="card p-4 shadow-sm">
      <h2 className="mb-4 text-center">Monte sua Pizza</h2>

      {alerta && (
        <div className={`alert alert-${alerta.tipo} text-center`} role="alert">
          {alerta.mensagem}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label fw-bold">Tamanho</label>
        <div>
          {tamanhos.map((t) => (
            <div key={t} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                id={`t-${t}`}
                name="tamanho"
                value={t}
                checked={form.tamanho === t}
                onChange={() => setForm({ tamanho: t, sabores: [], quantidade: form.quantidade })}
              />
              <label className="form-check-label" htmlFor={`t-${t}`}>
                {t} <span className="text-muted">({formatarPreco(PRECO_POR_TAMANHO[t])})</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Sabores</label>
        <div className="row">
          {sabores.map((s) => (
            <div key={s.id} className="form-check col-12 col-md-6 mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id={`s-${s.id}`}
                checked={form.sabores.includes(s.id)}
                disabled={!form.tamanho}
                onChange={() => toggleSabor(s.id)}
              />
              <label className="form-check-label ms-2" htmlFor={`s-${s.id}`}>{s.nome}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Quantidade</label>
        <input
          type="number"
          className="form-control w-auto"
          style={{ minWidth: '80px' }}
          value={form.quantidade}
          min="1"
          onChange={handleQuantidade}
        />
      </div>

      <div className="text-center">
        <Button className="px-4" onClick={handleAdd}>
          Adicionar ao Carrinho
        </Button>
      </div>
    </div>
  );
}