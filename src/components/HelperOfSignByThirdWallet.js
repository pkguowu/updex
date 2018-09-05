import React from 'react'
import { connect } from 'dva'
import { Icon } from 'antd'

class SignByThirdWallet extends React.Component {

  sign = (wallet) => {
    const {helperOfSign,dispatch} = this.props
    const {data} = helperOfSign
    window.location = `${wallet}://${JSON.stringify(data)}`
    dispatch({
      type: 'layers/hideLayer',
      payload: {
        id: 'helperOfSign'
      }
    })
  }
  render () {
    return (
      <div className="bg-white">
        <div className="row ml0 mr0 p15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
          <div className="col-auto text-right">
            <Icon className="color-black-4" type="left" />
          </div>
          <div className="col text-cennter">
           <div className="fs18 color-black-1 text-center">选择钱包进行签名</div>
          </div>
          <div className="col-auto text-right">
            <Icon className="color-black-4" type="close" />
          </div>
        </div>

        <div className="row ml0 mr0 p15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
          <div className="col text-left">
            <img style={{height:'35px'}} src={require('../assets/images/up-logo-notext.png')} alt=""/>
            <span className="fs16 color-black-1 text-left ml10">
              UP Wallet
            </span>
          </div>
          <div className="col-auto text-right">
            <div className="fs14 text-wrap text-left">
              <Icon className="color-black-2" type="right" />
            </div>
          </div>
        </div>

        <div className="row ml0 mr0 p15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
          <div className="col text-left">
            <div className="d-inline-block color-black-1 text-center" style={{
              width: '35px',
              height: '35px',
            }}>
              <img style={{borderRadius: '6px'}} width="100%" src={require('../assets/images/loopr.png')} alt=""/>
            </div>
            <span className="fs16 color-black-1 text-left ml10">
              Loopr
            </span>
          </div>
          <div className="col-auto text-right">
            <div className="fs14 text-wrap text-left">
              <span className="color-black-4 mr5">Coming Soon</span>
              <Icon className="color-black-2" type="right" />
            </div>
          </div>
        </div>
        <div className="row ml0 mr0 p15 zb-b-b no-gutters align-items-center" style={{padding:'7px 0px'}}>
          <div className="col text-left">
            <div className="d-inline-block color-black-1 text-center" style={{
              width: '35px',
              height: '35px',
            }}>
              <img style={{borderRadius: '6px'}} width="100%" src={require('../assets/images/imtoken.png')} alt=""/>
            </div>
            <span className="fs16 color-black-1 text-left ml10">
              imToken
            </span>
          </div>
          <div className="col-auto text-right">
            <div className="fs14 text-wrap text-left">
              <span className="color-black-4 mr5">Coming Soon</span>
              <Icon className="color-black-2" type="right" />
            </div>
          </div>
        </div>
        <div className="fs13 color-black-4 text-center p10">
          More Wallets is Comming Soon
        </div>
      </div>
    )
  }

}


function mapStateToProps (state) {

}

export default connect(mapStateToProps)(SignByThirdWallet)