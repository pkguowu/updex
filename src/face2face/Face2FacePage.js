import React from 'react'
import { NavBar, Tabs,Toast } from 'antd-mobile'
import { Icon as WebIcon } from 'antd'
import { connect } from 'dva'
import routeActions from 'common/utils/routeActions'
import { getTokensByMarket } from 'modules/formatter/common'
import HelperOfOrders from './HelperOfOrders'
import HelperOfBalances from './HelperOfBalances'
import HelperOfMarkets from './HelperOfMarkets'
import Face2FaceForm from './Face2FaceForm'
import intl from 'react-intl-universal'
import {store} from "../index";

class Face2FacePage extends React.Component {

  // componentDidMount(){
  //    window.handleP2POrder({result:JSON.stringify({value:{"auth":"45447993b644a00d7d6aaa4351482d29c4c4a0909704169df0262681281ec443","hash":"0x390809f080bfd439f66f762efa15276fee9d7377c8f8e4001c7ffb443040866d","count":1}})})
  // }
  render() {
    const {dispatch,placeOrder} = this.props
    const {side,pair} = placeOrder
    const pairTokens = getTokensByMarket(pair)
    const showLayer = (payload={})=>{
      dispatch({
        type:'layers/showLayer',
        payload:{
          ...payload
        }
      })
    }
    const hideLayer = (payload={})=>{
      dispatch({
        type:'layers/hideLayer',
        payload:{
          ...payload
        }
      })
    }
    const sideChange = (side)=>{
      dispatch({
        type:'placeOrder/sideChangeEffects',
        payload:{
          side
        }
      })
   }

   const gotoTrade = ()=>{
      routeActions.gotoPath(`/dex/markets/${pair}`)
    }
    const swap = () => {
      dispatch({type:'p2pOrder/swap'})
    }
    return (
        <div className="">
          <div className="bg-white">
            <NavBar
              className="zb-b-b"
              mode="light"
              leftContent={[
                <span onClick={()=>showLayer({id:'settings'})} className="text-primary" key="1"><WebIcon type="setting" theme="" /></span>
              ]}
              rightContent={[
                <span onClick={()=>showLayer({id:'helperOfFAQ'})} className="text-primary" key="1"><WebIcon type="question-circle" theme="" /></span>
              ]}
            >
              <div className="color-black">
                {intl.get('p2p_order.order_title')}
              </div>
            </NavBar>
          </div>
          <div className="bg-white">
            <Face2FaceForm side="sell" showLayer={showLayer} />
          </div>
          <div hidden className="bg-white mt10">
            <div className="fs16 pt10 pb10 pl15 color-black-1">{intl.get('common.markets')}</div>
            <div className="zb-b-t">
              <HelperOfMarkets />
            </div>
          </div>
          <div className="bg-white mt10">
            <div className="fs16 pt10 pb10 pl15 color-black-1">{intl.get('user_center.my_assets')}</div>
            <div className="zb-b-t">
              <HelperOfBalances />
            </div>
          </div>
          <div className="bg-white mt10">
            <div className="fs16 pt10 pb10 pl15 color-black-1">{intl.get('user_center.my_orders')}</div>
            <div className="zb-b-t">
              <HelperOfOrders />
            </div>
          </div>
        </div>
    );
  }
}
export default connect(({placeOrder})=>({placeOrder}))(Face2FacePage)





