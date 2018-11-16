import React from 'react';
import {Icon,Alert} from 'antd'
import {Button, NavBar, Toast,Result,Modal} from 'antd-mobile'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'

class SignResult extends React.Component {

  render(){
    const {dispatch} = this.props
    const hideLayer = (payload = {}) => {
      dispatch({
        type: 'layers/hideLayer',
        payload: {
          ...payload
        }
      })
    }
    const updated = ()=>{
      hideLayer({id:'signResult'})
    }
    const unUpdated = ()=>{
      Modal.alert('网页端还未同步更新？', null, [
        { text: '继续等待', onPress: () => console.log('cancel') },
        { text: '再次扫码', onPress: () => console.log('ok') },
      ])
    }
    return (
      <div className="bg-fill" style={{maxHeight:'100%',overflow:'auto'}}>
        <NavBar
          className="bg-white"
          mode="light"
          onLeftClick={() => hideLayer({id:'signResult'})}
          leftContent={[
            <span className="text-primary circle-30 bg-primary-light center-center fs14"><Icon key="1" type="close" /></span>,
          ]}
          rightContent={[]}
        >
          Result
        </NavBar>
        <div className="divider 1px zb-b-t"></div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-success fs50 center-center color-white" type="check-circle" theme="filled" />}
            title={<div className="fs20">登录签名成功</div>}
            message={<div className="fs12">请确认网页端是否已经登录</div>}
          />
          <Button className="w-100 d-block mt15 mb0 fs16" size="" type="primary" onClick={updated}><Icon className="mr5" type="desktop" />已登录</Button>
          <Button className="w-100 d-block mt15 mb0 fs16 bg-primary-light text-primary border-none mt15" size="" type="default" onClick={unUpdated}><Icon className="mr5" type="desktop" />未登录</Button>
        </div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-success fs50 center-center color-white" type="check-circle" theme="filled" />}
            title={<div className="fs20">下单签名成功</div>}
            message={<div className="fs12">请确认网页端是否已更新</div>}
          />
          <Button className="w-100 d-block mt15 mb0 fs16" size="" type="primary" onClick={updated}><Icon className="mr5" type="desktop" />已更新</Button>
          <Button className="w-100 d-block mt15 mb0 fs16 bg-primary-light text-primary border-none mt15" size="" type="default" onClick={unUpdated}><Icon className="mr5" type="desktop" />未更新</Button>
        </div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-success fs50 center-center color-white" type="check-circle" theme="filled" />}
            title={<div className="fs20">取消订单签名成功</div>}
            message={<div className="fs12">请确认网页端是否已更新</div>}
          />
          <Button className="w-100 d-block mt15 mb0 fs16" size="" type="primary" onClick={updated}><Icon className="mr5" type="desktop" />已更新</Button>
          <Button className="w-100 d-block mt15 mb0 fs16 bg-primary-light text-primary border-none mt15" size="" type="default" onClick={unUpdated}><Icon className="mr5" type="desktop" />未更新</Button>
        </div>
        <div className="bg-white p15" style={{}}>
          <Result
            img={<Icon className="color-error fs50 center-center color-white" type="close-circle" theme="filled" />}
            title={<div className="fs20">操作失败</div>}
            message={<div className="fs12">操作失败</div>}
          />
          <Button className="w-100 d-block mt15 mb0" size="" type="primary" onClick={()=>{}} disabled={false}>继续扫码</Button>
        </div>
      </div>
    );
  }

};

function mapToProps(state) {
  return {
  }
}
export default connect(mapToProps)(SignResult)
