import React from 'react';
import {FillFm} from 'modules/fills/formatters'
import {getFormatTime,getTokensByMarket} from "modules/formatter/common";
import {connect} from 'dva'
import {toBig, toNumber} from 'LoopringJS/common/formatter'
import intl from 'react-intl-universal'
import Worth from 'modules/settings/Worth'

const ListMarketFills = ({trades={},maxRows=5})=>{
  // const maxHeight = (60*maxRows+32) + 'px'
  const market = trades.filters.market || 'LRC-WETH'
  const tokens = getTokensByMarket(market)
  const maxHeight = 'auto'
  console.log('ListMarketFills',trades)
  return (
    <div style={{height:maxHeight,overflow:'auto'}}>
      <table className="w-100 fs12" style={{overflow:'auto'}}>
        <thead>
          <tr className="">
            <th className="zb-b-b text-left pl15 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.price")} </th>
            <th className="zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.amount")} / {tokens.left}</th>
            <th hidden className="zb-b-b text-right pl5 pr5 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.LRCFee")} / LRC</th>
            <th className="zb-b-b text-right pl5 pr15 pt5 pb5 font-weight-normal color-black-4">{intl.get("common.time")}</th>
          </tr>
        </thead>
        <tbody>
            <tr className=""><td className="lh10 pt5" colSpan="10"></td></tr>
            {
              trades.items && trades.items.map((item,index)=>{
                // const fillFm = new FillFm({...item,market})
                return (
                  <tr key={index}>
                    <td className="lh20 border-none pl15 pr5 text-left align-middle">
                      {
                        index%2 === 0 && <span className="color-error">{item.price.toFixed(8)} <span className="fs12 color-black-4"><Worth amount={item.price.toFixed(8)} symbol={tokens.right}/></span></span>
                      }
                      {
                        index%2 === 1 && <span className="color-success">{item.price.toFixed(8)} <span className="fs12 color-black-4"><Worth amount={item.price.toFixed(8)} symbol={tokens.right}/></span></span>
                      }
                    </td>
                    <td className="lh20 border-none pl5 pr5 color-black-2 text-right align-middle text-nowrap">
                      {item.amount.toFixed(4)}
                    </td>
                    <td hidden className="lh20 border-none pl5 pr5 text-right color-black-2 align-middle text-nowrap">
                      {item.lrcFee}
                    </td>
                    <td className="lh20 border-none pl5 pr15 color-black-2 text-right align-middle text-nowrap">
                      {getFormatTime(toNumber(item.createTime) * 1e3,'MM-DD HH:mm')}
                    </td>
                  </tr>
                )
              })
            }
        </tbody>
      </table>
    </div>

  )
}

export default connect(
  ({sockets:{trades}})=>({trades})
)(ListMarketFills)
