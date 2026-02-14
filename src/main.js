import './style.css'
import { supabase } from './supabase.js'

const app = document.querySelector('#app')
let ssdData = []
let isAdmin = false
let filters = {
  series: 'All',
  model: 'All',
  capacity: 'All',
  nand: 'All',
  formFactor: 'All'
}

const ADMIN_PASSWORD = 'Membl@ze12345'

function getUniqueValues(data, key) {
  return ['All', ...new Set(data.map(item => item[key]))].sort()
}

function render() {
  const filteredData = ssdData.filter(item => {
    return (filters.series === 'All' || item.series === filters.series) &&
           (filters.model === 'All' || item.model === filters.model) &&
           (filters.capacity === 'All' || item.capacity === filters.capacity) &&
           (filters.nand === 'All' || item.nand === filters.nand) &&
           (filters.formFactor === 'All' || item.form_factor === filters.formFactor)
  })

  const seriesOptions = getUniqueValues(ssdData, 'series')
  const modelOptions = getUniqueValues(ssdData, 'model')
  const capacityOptions = getUniqueValues(ssdData, 'capacity')
  const nandOptions = getUniqueValues(ssdData, 'nand')
  const formFactorOptions = getUniqueValues(ssdData, 'form_factor')

  app.innerHTML = `
    <nav class="navbar navbar-dark mb-4">
      <div class="container-fluid px-4">
        <span class="navbar-brand brand-text">
          <i data-lucide="database" class="me-2"></i>MEMBLAZE SPECS
        </span>
        <div class="d-flex align-items-center">
          ${isAdmin ? 
            `<button id="logout-btn" class="btn btn-outline-light btn-sm me-2">Logout Admin</button>
             <button id="add-ssd-btn" class="btn btn-success btn-sm"><i data-lucide="plus" class="me-1"></i>Add SSD</button>` : 
            `<button id="login-trigger" class="btn btn-outline-light btn-sm">Admin Login</button>`
          }
        </div>
      </div>
    </nav>

    <div class="container-fluid px-4">
      <header class="mb-4">
        <h1 class="display-6 fw-bold">Enterprise SSD Specifications</h1>
        <p class="text-muted">Management Dashboard ${isAdmin ? '<span class="badge bg-warning text-dark ms-2">Admin Mode</span>' : ''}</p>
      </header>

      <div class="row">
        <div class="col-lg-3 mb-4">
          <div class="card p-3 shadow-sm mb-4">
            <h5 class="card-title mb-3 d-flex align-items-center">
              <i data-lucide="filter" class="me-2" style="width: 18px;"></i> Filters
              <button id="reset-filters" class="btn btn-link btn-sm ms-auto p-0 text-decoration-none">Reset</button>
            </h5>
            
            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-muted">Series</label>
              <select class="form-select form-select-sm filter-select" data-filter="series">
                ${seriesOptions.map(opt => `<option value="${opt}" ${filters.series === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-muted">Model</label>
              <select class="form-select form-select-sm filter-select" data-filter="model">
                ${modelOptions.map(opt => `<option value="${opt}" ${filters.model === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-muted">Capacity</label>
              <select class="form-select form-select-sm filter-select" data-filter="capacity">
                ${capacityOptions.map(opt => `<option value="${opt}" ${filters.capacity === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-muted">NAND</label>
              <select class="form-select form-select-sm filter-select" data-filter="nand">
                ${nandOptions.map(opt => `<option value="${opt}" ${filters.nand === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label small fw-bold text-uppercase text-muted">Form Factor</label>
              <select class="form-select form-select-sm filter-select" data-filter="formFactor">
                ${formFactorOptions.map(opt => `<option value="${opt}" ${filters.formFactor === opt ? 'selected' : ''}>${opt}</option>`).join('')}
              </select>
            </div>

            <div class="mt-2 pt-2 border-top">
              <p class="small text-muted mb-0">Showing <strong>${filteredData.length}</strong> of <strong>${ssdData.length}</strong> results</p>
            </div>
          </div>
        </div>

        <div class="col-lg-9">
          <div class="table-responsive shadow-sm bg-white p-2 rounded">
            <table class="table table-hover align-middle spec-table mb-0">
              <thead>
                <tr>
                  <th rowspan="2">Series / Model</th>
                  <th rowspan="2">Capacity</th>
                  <th rowspan="2">NAND</th>
                  <th rowspan="2">Form Factor</th>
                  <th rowspan="2">DWPD</th>
                  <th colspan="4" class="performance-header">PCIe 5.0 Performance</th>
                  ${isAdmin ? '<th rowspan="2" class="text-center">Actions</th>' : ''}
                </tr>
                <tr>
                  <th class="text-center small">Seq Read</th>
                  <th class="text-center small">Seq Write</th>
                  <th class="text-center small">Rand Read</th>
                  <th class="text-center small">Rand Write</th>
                </tr>
              </thead>
              <tbody>
                ${filteredData.length > 0 ? filteredData.map(item => `
                  <tr>
                    <td><span class="fw-bold">${item.model}</span><br><small class="text-muted">${item.series}</small></td>
                    <td><span class="badge bg-light text-dark">${item.capacity}</span></td>
                    <td>${item.nand}</td>
                    <td>${item.form_factor}</td>
                    <td><span class="badge ${item.endurance_dwpd >= 3 ? 'bg-success' : 'bg-info'} badge-dwpd">${item.endurance_dwpd} DWPD</span></td>
                    <td class="text-center fw-semibold text-primary">${item.seq_read_gb_s}</td>
                    <td class="text-center fw-semibold text-primary">${item.seq_write_gb_s}</td>
                    <td class="text-center fw-semibold text-danger">${item.rand_read_kiops}</td>
                    <td class="text-center fw-semibold text-danger">
                      ${item.rand_write_kiops}
                      ${item.note ? `<i data-lucide="info" class="ms-1 text-muted" title="${item.note}" style="width: 14px; cursor: help;"></i>` : ''}
                    </td>
                    ${isAdmin ? `
                      <td class="text-center">
                        <div class="btn-group btn-group-sm">
                          <button class="btn btn-outline-primary edit-btn" data-id="${item.id}"><i data-lucide="edit-2" style="width:14px"></i></button>
                          <button class="btn btn-outline-danger delete-btn" data-id="${item.id}"><i data-lucide="trash-2" style="width:14px"></i></button>
                        </div>
                      </td>
                    ` : ''}
                  </tr>
                `).join('') : '<tr><td colspan="${isAdmin ? 10 : 9}" class="text-center py-5 text-muted">No matching SSDs found.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div id="modal-container"></div>
  `

  if (window.lucide) {
    window.lucide.createIcons()
  }

  setupEventListeners()
}

function setupEventListeners() {
  document.querySelectorAll('.filter-select').forEach(select => {
    select.addEventListener('change', (e) => {
      filters[e.target.dataset.filter] = e.target.value
      render()
    })
  })

  document.getElementById('reset-filters')?.addEventListener('click', () => {
    filters = { series: 'All', model: 'All', capacity: 'All', nand: 'All', formFactor: 'All' }
    render()
  })

  document.getElementById('login-trigger')?.addEventListener('click', () => {
    const password = prompt('Enter Admin Password:')
    if (password === ADMIN_PASSWORD) {
      isAdmin = true
      render()
    } else if (password !== null) {
      alert('Incorrect password!')
    }
  })

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    isAdmin = false
    render()
  })

  document.getElementById('add-ssd-btn')?.addEventListener('click', () => showSSDForm())
  
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = ssdData.find(d => d.id === btn.dataset.id)
      console.log('Editing Item:', item)
      showSSDForm(item)
    })
  })

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this specification?')) {
        const { error } = await supabase.from('ssd_specs').delete().eq('id', btn.dataset.id)
        if (error) alert('Error: ' + error.message)
        else init()
      }
    })
  })
}

function showSSDForm(item = null) {
  const isEdit = !!item
  const modalHtml = `
    <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${isEdit ? 'Edit SSD' : 'Add New SSD'}</h5>
            <button type="button" class="btn-close" id="close-modal"></button>
          </div>
          <div class="modal-body">
            <form id="ssd-form" class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Series</label>
                <input type="text" class="form-control" name="series" value="${item?.series || ''}" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Model</label>
                <input type="text" class="form-control" name="model" value="${item?.model || ''}" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">Capacity</label>
                <input type="text" class="form-control" name="capacity" value="${item?.capacity || ''}" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">NAND</label>
                <input type="text" class="form-control" name="nand" value="${item?.nand || ''}" required>
              </div>
              <div class="col-md-4">
                <label class="form-label">Form Factor</label>
                <input type="text" class="form-control" name="form_factor" value="${item?.form_factor || ''}" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">DWPD</label>
                <input type="number" step="0.1" class="form-control" name="endurance_dwpd" value="${item?.endurance_dwpd || 1}" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Seq Read (GB/s)</label>
                <input type="number" step="0.1" class="form-control" name="seq_read_gb_s" value="${item?.seq_read_gb_s || ''}" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Seq Write (GB/s)</label>
                <input type="number" step="0.1" class="form-control" name="seq_write_gb_s" value="${item?.seq_write_gb_s || ''}" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Rand Read (KIOPS)</label>
                <input type="number" class="form-control" name="rand_read_kiops" value="${item?.rand_read_kiops || ''}" required>
              </div>
              <div class="col-md-3">
                <label class="form-label">Rand Write (KIOPS)</label>
                <input type="number" class="form-control" name="rand_write_kiops" value="${item?.rand_write_kiops || ''}" required>
              </div>
              <div class="col-md-9">
                <label class="form-label">Note</label>
                <input type="text" class="form-control" name="note" value="${item?.note || ''}">
              </div>
              <div class="col-12 text-end mt-4">
                <button type="button" class="btn btn-secondary me-2" id="cancel-modal">Cancel</button>
                <button type="submit" class="btn btn-primary">${isEdit ? 'Update Specification' : 'Add Specification'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
  document.getElementById('modal-container').innerHTML = modalHtml

  const closeModal = () => document.getElementById('modal-container').innerHTML = ''
  document.getElementById('close-modal').addEventListener('click', closeModal)
  document.getElementById('cancel-modal').addEventListener('click', closeModal)

  document.getElementById('ssd-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const rawPayload = Object.fromEntries(formData.entries())
    
    const payload = {
      series: rawPayload.series,
      model: rawPayload.model,
      capacity: rawPayload.capacity,
      nand: rawPayload.nand,
      form_factor: rawPayload.form_factor,
      endurance_dwpd: parseFloat(rawPayload.endurance_dwpd) || 0,
      seq_read_gb_s: parseFloat(rawPayload.seq_read_gb_s) || 0,
      seq_write_gb_s: parseFloat(rawPayload.seq_write_gb_s) || 0,
      rand_read_kiops: parseInt(rawPayload.rand_read_kiops) || 0,
      rand_write_kiops: parseInt(rawPayload.rand_write_kiops) || 0,
      note: rawPayload.note || null
    }

    if (isEdit) {
      console.log('Sending Update Payload:', payload, 'for ID:', item.id)
      const { data, error, count } = await supabase
        .from('ssd_specs')
        .update(payload)
        .eq('id', item.id)
        .select()

      if (error) {
        alert(`Update Failed: ${error.message}`)
      } else if (!data || data.length === 0) {
        alert('Update successful, but 0 rows were modified. This might be due to a Row Level Security (RLS) policy or an invalid ID.')
        console.warn('Update returned empty data array. Check RLS policies.')
      } else {
        alert('Updated successfully!')
        closeModal()
        init()
      }
    } else {
      const { data, error } = await supabase
        .from('ssd_specs')
        .insert([payload])
        .select()

      if (error) {
        alert(`Insert Failed: ${error.message}`)
      } else {
        alert('Added successfully!')
        closeModal()
        init()
      }
    }
  })
}

async function init() {
  app.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading specifications...</p></div>'
  
  const { data, error } = await supabase
    .from('ssd_specs')
    .select('*')
    .order('series', { ascending: true })

  if (error) {
    console.error('Error fetching data:', error)
    app.innerHTML = `<div class="alert alert-danger m-5">Error loading data: ${error.message}</div>`
    return
  }

  ssdData = data
  render()
}

init()
