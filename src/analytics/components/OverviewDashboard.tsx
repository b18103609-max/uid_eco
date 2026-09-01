import { useState } from 'react';
import { filterIndicatorContracts } from '../calculations/indicators.ts';
import { INDICATOR_CONTRACTS } from '../data/indicatorsData.ts';
import { CONTRACT_BREACHES } from '../data/contractBreachesData.ts';
import { RATING_RECORDS } from '../data/ratingData.ts';
import { PRECLAIM_CASES } from '../data/preclaimData.ts';
import type { AnalyticsFilters } from '../filters.ts';
import type { AnalyticsPageId } from '../routing.ts';
import './overview.css';

type DetailKind='contracts'|'breaches'|'rating'|'dpr';
const money=(value:number)=>new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(value);
export const OverviewDashboard=({filters,onNavigate}:{filters:AnalyticsFilters;onNavigate:(page:AnalyticsPageId)=>void})=>{
  const[dimension,setDimension]=useState<'service'|'kt777'|'subsidiary'>('service');
  const[detail,setDetail]=useState<DetailKind>('contracts');
  const contracts=filterIndicatorContracts(INDICATOR_CONTRACTS,filters);
  const contractors=new Set(contracts.map(x=>x.contractor));
  const breaches=CONTRACT_BREACHES.filter(x=>contractors.has(x.contractor));
  const latestRatings=RATING_RECORDS.filter(x=>x.period==='Июл'&&contractors.has(x.contractor));
  const redRatings=latestRatings.filter(x=>x.zone==='Красная');
  const dpr=PRECLAIM_CASES.filter(x=>contractors.has(x.contractor));
  const totalAmount=contracts.reduce((s,x)=>s+x.amountMln,0);
  const groups=Object.entries(contracts.reduce<Record<string,{count:number;amount:number}>>((r,x)=>{const key=x[dimension];r[key]||={count:0,amount:0};r[key].count++;r[key].amount+=x.amountMln;return r},{})).sort((a,b)=>b[1].amount-a[1].amount).slice(0,12);
  const maxAmount=Math.max(1,...groups.map(x=>x[1].amount));
  const objects=detail==='contracts'?contracts:detail==='breaches'?breaches:detail==='rating'?redRatings:dpr;
  return <div className="overview-dashboard">
    <section className="overview-summary"><button onClick={()=>setDetail('contracts')}><span>Договоры</span><strong>{contracts.length}</strong><em>{money(totalAmount)} млн ₽</em><small>количество и общая стоимость</small></button><button onClick={()=>setDetail('rating')}><span>Подрядчики с красными бригадами</span><strong>{new Set(redRatings.map(x=>x.contractor)).size}</strong><em>по методологии «Флагман»</em></button><button onClick={()=>setDetail('breaches')}><span>Договорные нарушения</span><strong>{breaches.length}</strong><em>за выбранный период</em></button><button onClick={()=>setDetail('dpr')}><span>ДПР с отклонением</span><strong>{dpr.filter(x=>x.deviation>0).length}</strong><em>от нормативного срока</em></button></section>
    <section className="overview-main"><article className="overview-chart"><header><div><h2>Как распределён объём договоров?</h2><span>Агрегация рассчитана на большие выборки; отображается top‑12</span></div><nav><button onClick={()=>setDimension('service')}>Группы</button><button onClick={()=>setDimension('kt777')}>Услуги КТ‑777</button><button onClick={()=>setDimension('subsidiary')}>ДО</button></nav></header><div className="money-bars">{groups.map(([label,value])=><button key={label} onClick={()=>setDetail('contracts')}><span>{label}</span><i><b style={{width:`${value.amount/maxAmount*100}%`}}/></i><strong>{money(value.amount)} млн ₽</strong><small>{value.count} дог.</small></button>)}</div></article>
    <aside className="attention-panel"><header><h2>Требует внимания</h2><span>Прямые признаки без сводного приоритета</span></header>{contracts.filter(x=>x.oedkZone==='Красная').slice(0,1).map(x=><button key={'o'+x.id} onClick={()=>setDetail('contracts')}><strong>{x.contractor}</strong><span>Красная зона ОЭДК</span><small>{x.number}</small></button>)}{contracts.filter(x=>x.risk==='Высокий'&&(['contract-1','contract-6'].includes(x.id))).slice(0,1).map(x=><button key={'t'+x.id} onClick={()=>setDetail('contracts')}><strong>{x.contractor}</strong><span>Высокий риск, команда не назначена</span><small>Нет ЕОЛ / КИ · {x.number}</small></button>)}{dpr.filter(x=>x.deviation>0).slice(0,1).map(x=><button key={x.id} onClick={()=>setDetail('dpr')}><strong>{x.contractor}</strong><span>ДПР: +{x.deviation} дней</span><small>{x.id}</small></button>)}{redRatings.slice(0,1).map(x=><button key={x.brigade} onClick={()=>setDetail('rating')}><strong>{x.contractor}</strong><span>Бригада в красной зоне</span><small>{x.brigade} · {x.score} баллов</small></button>)}<div className="attention-unavailable"><strong>Просроченные ПКМ</strong><span>Нужна контрольная дата мероприятия</span></div></aside></section>
    <section className="overview-secondary"><article className="overview-chart"><header><h2>Распределение бригад по зонам сейчас</h2><span>В разрезе подрядчиков</span></header><div className="current-zones">{latestRatings.map(x=><div key={x.brigade}><span>{x.contractor}</span><i className={`current-zone current-zone--${x.zone.toLowerCase()}`}/><strong>{x.brigade}</strong></div>)}</div></article><article className="overview-chart"><header><h2>Нарушения по категориям за 3 месяца</h2><span>Типовые и нетиповые</span></header><div className="breach-category-chart">{[...new Set(breaches.map(x=>x.category))].map(category=>{const typical=breaches.filter(x=>x.category===category&&x.kind==='Типовое').length,other=breaches.filter(x=>x.category===category&&x.kind==='Нетиповое').length;return<button key={category} onClick={()=>setDetail('breaches')}><span>{category}</span><i><b style={{flex:typical}}/><em style={{flex:other}}/></i><strong>{typical+other}</strong></button>})}</div><footer><span><i className="breach-typical"/>Типовые</span><span><i className="breach-atypical"/>Нетиповые</span></footer></article></section>
    <section className="overview-objects"><header><div><h2>Объекты, из которых складывается показатель</h2><span>{({contracts:'Договоры',breaches:'Нарушения',rating:'Бригады',dpr:'ДПР'} as const)[detail]} · показаны первые 5 из {objects.length}</span></div><button onClick={()=>onNavigate(detail==='contracts'?'indicators':detail==='breaches'?'safety':detail==='rating'?'rating':'preclaim')}>Открыть раздел →</button></header><div>{objects.slice(0,5).map((item:any)=><article key={item.id||item.brigade}><strong>{item.number||item.id||item.brigade}</strong><span>{item.contractor}</span><small>{item.amountMln?`${money(item.amountMln)} млн ₽`:item.category||item.zone||item.stage}</small></article>)}</div></section>
  </div>;
};
