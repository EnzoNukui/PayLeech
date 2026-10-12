import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FiPlus, FiRefreshCw } from 'react-icons/fi'
import CategoryFormDialog from '../../components/Assinaturas/CategoryFormDialog/CategoryFormDialog'
import DeleteSubscriptionDialog from '../../components/Assinaturas/DeleteSubscriptionDialog/DeleteSubscriptionDialog'
import SubscriptionCard from '../../components/Assinaturas/SubscriptionCard/SubscriptionCard'
import SubscriptionFilters from '../../components/Assinaturas/SubscriptionFilters/SubscriptionFilters'
import SubscriptionFormDialog from '../../components/Assinaturas/SubscriptionFormDialog/SubscriptionFormDialog'
import Button from '../../components/ui/Button/Button'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import LoadingState from '../../components/ui/LoadingState/LoadingState'
import PageTitle from '../../components/ui/PageTitle/PageTitle'
import { assinaturaService, categoriaService } from '../../service/assinaturaService'
import { suggestedCategories } from '../../data/subscriptionCatalog'
import type { Assinatura, AssinaturaPayload, Categoria, CategoriaPayload, StatusAssinatura } from '../../types/assinatura'

function Assinaturas() {
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [status, setStatus] = useState<StatusAssinatura | ''>('')
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [busca, setBusca] = useState('')
  const [carregandoAssinaturas, setCarregandoAssinaturas] = useState(true)
  const [carregandoCategorias, setCarregandoCategorias] = useState(true)
  const [erroAssinaturas, setErroAssinaturas] = useState('')
  const [erroCategorias, setErroCategorias] = useState('')
  const [erroCategoriasSugeridas, setErroCategoriasSugeridas] = useState('')
  const [criandoCategoriasSugeridas, setCriandoCategoriasSugeridas] = useState(false)
  const [formAberto, setFormAberto] = useState(false)
  const [categoriaFormAberto, setCategoriaFormAberto] = useState(false)
  const [assinaturaEditando, setAssinaturaEditando] = useState<Assinatura | null>(null)
  const [assinaturaExcluindo, setAssinaturaExcluindo] = useState<Assinatura | null>(null)
  const requisicaoAssinaturas = useRef(0)

  const carregarAssinaturas = useCallback(async () => {
    const requisicaoAtual = ++requisicaoAssinaturas.current
    try {
      const resultado = await assinaturaService.listar({ status, categoriaId })
      if (requisicaoAtual === requisicaoAssinaturas.current) setAssinaturas(resultado)
    } catch (error) {
      if (requisicaoAtual === requisicaoAssinaturas.current) {
        setErroAssinaturas(error instanceof Error ? error.message : 'Não foi possível carregar as assinaturas.')
      }
    } finally {
      if (requisicaoAtual === requisicaoAssinaturas.current) setCarregandoAssinaturas(false)
    }
  }, [categoriaId, status])

  const carregarCategorias = useCallback(async () => {
    try {
      const resultado = await categoriaService.listar()
      setCategorias(resultado.toSorted((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    } catch (error) {
      setErroCategorias(error instanceof Error ? error.message : 'Não foi possível carregar as categorias.')
    } finally {
      setCarregandoCategorias(false)
    }
  }, [])

  useEffect(() => {
    void carregarAssinaturas()
  }, [carregarAssinaturas])

  useEffect(() => {
    void carregarCategorias()
  }, [carregarCategorias])

  const opcoesCategoria = useMemo(
    () => categorias.map((categoria) => ({ value: String(categoria.id), label: categoria.nome })),
    [categorias],
  )

  const assinaturasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR')
    if (!termo) return assinaturas
    return assinaturas.filter((assinatura) =>
      assinatura.nome.toLocaleLowerCase('pt-BR').includes(termo)
      || assinatura.categoria.nome.toLocaleLowerCase('pt-BR').includes(termo),
    )
  }, [assinaturas, busca])

  function abrirCriacao() {
    setAssinaturaEditando(null)
    setFormAberto(true)
  }

  function abrirEdicao(assinatura: Assinatura) {
    setAssinaturaEditando(assinatura)
    setFormAberto(true)
  }

  async function salvarAssinatura(payload: AssinaturaPayload) {
    if (assinaturaEditando) {
      await assinaturaService.atualizar(assinaturaEditando.codigo, payload)
    } else {
      await assinaturaService.criar(payload)
    }
    setFormAberto(false)
    setAssinaturaEditando(null)
    setCarregandoAssinaturas(true)
    setErroAssinaturas('')
    await carregarAssinaturas()
  }

  async function excluirAssinatura(assinatura: Assinatura) {
    await assinaturaService.excluir(assinatura.codigo)
    setAssinaturaExcluindo(null)
    setCarregandoAssinaturas(true)
    setErroAssinaturas('')
    await carregarAssinaturas()
  }

  async function criarCategoria(payload: CategoriaPayload) {
    const categoriaCriada = await categoriaService.criar(payload)
    setCategorias((atuais) => [...atuais, categoriaCriada].toSorted((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
    alterarCategoria(categoriaCriada.id)
    setCategoriaFormAberto(false)
  }

  async function adicionarCategoriasSugeridas() {
    const nomesExistentes = new Set(categorias.map((categoria) => categoria.nome.trim().toLocaleLowerCase('pt-BR')))
    const faltantes = suggestedCategories.filter((categoria) => !nomesExistentes.has(categoria.nome.toLocaleLowerCase('pt-BR')))
    setCriandoCategoriasSugeridas(true)
    setErroCategoriasSugeridas('')
    try {
      for (const categoria of faltantes) await categoriaService.criar(categoria)
      await carregarCategorias()
    } catch (error) {
      await carregarCategorias()
      setErroCategoriasSugeridas(error instanceof Error ? error.message : 'Não foi possível adicionar as categorias sugeridas.')
    } finally {
      setCriandoCategoriasSugeridas(false)
    }
  }

  function limparFiltros() {
    if (status || categoriaId) setCarregandoAssinaturas(true)
    setErroAssinaturas('')
    setBusca('')
    setStatus('')
    setCategoriaId('')
  }

  function alterarStatus(value: StatusAssinatura | '') {
    setCarregandoAssinaturas(true)
    setErroAssinaturas('')
    setStatus(value)
  }

  function alterarCategoria(value: number | '') {
    setCarregandoAssinaturas(true)
    setErroAssinaturas('')
    setCategoriaId(value)
  }

  const temFiltros = Boolean(busca || status || categoriaId)

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <PageTitle
        action={
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button onClick={() => setCategoriaFormAberto(true)} variant="secondary">
              Nova categoria
            </Button>
            <Button disabled={categorias.length === 0} onClick={abrirCriacao}>
              <FiPlus aria-hidden="true" size={17} /> Nova assinatura
            </Button>
          </div>
        }
        description="Seus serviços recorrentes, reunidos em um só lugar."
        title="Assinaturas"
      />

      {erroCategorias && (
        <div className="mt-6 flex flex-col gap-3 rounded-card border border-danger/20 bg-danger-soft p-4 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p className="text-sm text-danger">{erroCategorias}</p>
          <Button onClick={() => { setCarregandoCategorias(true); setErroCategorias(''); void carregarCategorias() }} size="sm" variant="secondary"><FiRefreshCw aria-hidden="true" size={15} /> Tentar novamente</Button>
        </div>
      )}

      {((categorias.length === 0 && !carregandoCategorias && !erroCategorias) || Boolean(erroCategoriasSugeridas)) && (
        <div className="mt-6 flex flex-col gap-3 rounded-card border border-warning/25 bg-warning-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink">{erroCategoriasSugeridas ? 'Não foi possível adicionar todas as sugestões' : 'Comece com algumas categorias'}</p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">Entretenimento, produtividade, armazenamento e outros.</p>
            {erroCategoriasSugeridas && <p className="mt-2 text-xs text-danger" role="alert">{erroCategoriasSugeridas}</p>}
          </div>
          <Button loading={criandoCategoriasSugeridas} onClick={() => void adicionarCategoriasSugeridas()} variant="secondary">
            <FiPlus aria-hidden="true" size={16} /> Adicionar categorias sugeridas
          </Button>
        </div>
      )}

      <div className="mt-7">
        <SubscriptionFilters
          categories={opcoesCategoria}
          categoryId={categoriaId}
          onCategoryChange={alterarCategoria}
          onClear={limparFiltros}
          onSearchChange={setBusca}
          onStatusChange={alterarStatus}
          search={busca}
          status={status}
        />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-ink-muted">
          {carregandoAssinaturas ? 'Atualizando lista…' : `${assinaturasFiltradas.length} ${assinaturasFiltradas.length === 1 ? 'assinatura' : 'assinaturas'}`}
        </p>
        <button
          aria-label="Atualizar assinaturas"
          className="grid size-9 place-items-center rounded-xl text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink disabled:opacity-50"
          disabled={carregandoAssinaturas}
          onClick={() => { setCarregandoAssinaturas(true); setErroAssinaturas(''); void carregarAssinaturas() }}
          type="button"
        >
          <FiRefreshCw aria-hidden="true" className={carregandoAssinaturas ? 'animate-spin' : ''} size={16} />
        </button>
      </div>

      {carregandoAssinaturas ? (
        <div className="mt-3 rounded-card border border-border bg-surface">
          <LoadingState label="Carregando assinaturas…" />
        </div>
      ) : erroAssinaturas ? (
        <div className="mt-3 flex flex-col gap-3 rounded-card border border-danger/20 bg-danger-soft p-5 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <p className="text-sm text-danger">{erroAssinaturas}</p>
          <Button onClick={() => { setCarregandoAssinaturas(true); setErroAssinaturas(''); void carregarAssinaturas() }} variant="secondary"><FiRefreshCw aria-hidden="true" size={16} /> Tentar novamente</Button>
        </div>
      ) : assinaturasFiltradas.length > 0 ? (
        <ul className="mt-3 grid list-none gap-3 p-0" aria-label="Lista de assinaturas">
          {assinaturasFiltradas.map((assinatura) => (
            <li key={assinatura.codigo}>
              <SubscriptionCard assinatura={assinatura} onDelete={setAssinaturaExcluindo} onEdit={abrirEdicao} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3">
          <EmptyState
            action={
              temFiltros ? (
                <Button onClick={limparFiltros} variant="secondary">Limpar filtros</Button>
              ) : categorias.length > 0 ? (
                <Button onClick={abrirCriacao}><FiPlus aria-hidden="true" size={16} /> Adicionar assinatura</Button>
              ) : undefined
            }
            description={
              temFiltros
                ? 'Tente ajustar os filtros ou buscar por outro nome.'
                : categorias.length > 0
                  ? 'Adicione seu primeiro serviço recorrente para começar a acompanhar os gastos.'
                  : 'Organize suas assinaturas por categoria. Depois, você poderá cadastrar seus serviços.'
            }
            title={temFiltros ? 'Nenhuma assinatura encontrada' : 'Sua lista está começando'}
          />
        </div>
      )}

      {formAberto && (
        <SubscriptionFormDialog
          assinatura={assinaturaEditando}
          categories={opcoesCategoria}
          key={assinaturaEditando?.codigo ?? 'nova-assinatura'}
          onOpenChange={(open) => {
            setFormAberto(open)
            if (!open) setAssinaturaEditando(null)
          }}
          onSubmit={salvarAssinatura}
          open
        />
      )}
      <CategoryFormDialog
        onOpenChange={setCategoriaFormAberto}
        onSubmit={criarCategoria}
        open={categoriaFormAberto}
      />
      <DeleteSubscriptionDialog
        assinatura={assinaturaExcluindo}
        key={assinaturaExcluindo?.codigo ?? 'closed'}
        onConfirm={excluirAssinatura}
        onOpenChange={(open) => { if (!open) setAssinaturaExcluindo(null) }}
      />
    </div>
  )
}

export default Assinaturas
