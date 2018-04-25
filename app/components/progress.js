import React,{ Component } from 'react'
import './progress.less'

class Process extends Component {
    changeProgress(e){
    	//获取dom节点
        let progressBar = this.refs.progressBar;
        let progress = (e.clientX - progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
        this.props.onProgressChange && this.props.onProgressChange(progress);
    }
    render(){
    	return(
    		<div className="components-process" ref="progressBar" onClick={this.changeProgress.bind(this)}> 
    		    <div className="progress" style={{width:`${this.props.progress}%`,background:this.props.barColor}} ></div>		
    		</div>
    	)
    }
}

//props默认值设置
Process.defaultProps = {
  barColor: '#2f9842'
};

export default Process;