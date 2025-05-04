import React, { useState, useEffect, useContext } from 'react';
import * as tamanhosService from '../../services/tamanhos';
import * as saboresService from '../../services/sabores';
import { CarrinhoContext } from '../../context/CarrinhoContext';
import Button from '../../components/Button';

export default function MenuPage() {
  const [tamanhos, setTamanhos] = useState([]);
  const [sabores, setSabores] = useState([]);
  const [form, setForm] = useState({
    tamanho: '',
    sabores: [],
    quantidade: 1,
  });
  const { adicionarPizza } = useContext(CarrinhoContext);

  useEffect(() => {
    (async () => {
      setTamanhos(await tamanhosService.getAll());
      setSabores(await saboresService.getAll());
    })();
  }, []);

  function toggleSabor(id) {
    setForm(f => {
      const jáTem = f.sabores.includes(id);
      return {
        ...f,
        sabores: jáTem
          ? f.sabores.filter(s => s !== id)
          : [...f.sabores, id],
      };
    });
  }

  function handleQuantidade(e) {
    const qtd = parseInt(e.target.value, 10);
    setForm(f => ({ ...f, quantidade: qtd > 0 ? qtd : 1 }));
  }

  function handleAdd() {
    if (!form.tamanho || form.sabores.length === 0) {
      return alert('Escolha tamanho e pelo menos um sabor');
    }
    adicionarPizza(form);
    // limpa seleção
    setForm({ tamanho: '', sabores: [], quantidade: 1 });
  }

  return (
    <div>
      <h2 className="mb-4">Monte sua Pizza</h2>

      <div className="mb-3">
        <label className="form-label">Tamanho</label>
        {tamanhos.map(t => (
          <div key={t} className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              id={`t-${t}`}
              name="tamanho"
              value={t}
              checked={form.tamanho === t}
              onChange={() => setForm(f => ({ ...f, tamanho: t }))}
            />
            <label className="form-check-label" htmlFor={`t-${t}`}>
              {t}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Sabores</label>
        {sabores.map(s => (
          <div key={s.id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`s-${s.id}`}
              checked={form.sabores.includes(s.id)}
              onChange={() => toggleSabor(s.id)}
            />
            <label className="form-check-label" htmlFor={`s-${s.id}`}>
              {s.nome}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Quantidade</label>
        <input
          type="number"
          className="form-control"
          value={form.quantidade}
          min="1"
          onChange={handleQuantidade}
        />
      </div>

      <Button onClick={handleAdd}>Adicionar ao Carrinho</Button>
    </div>
  );
}
