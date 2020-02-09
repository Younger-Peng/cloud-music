import React, {useEffect} from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import {connect} from 'react-redux';
import * as actionTypes from './store/actionCreator';
import Scroll from '../../components/scroll';
import { Content } from './style.js'

function Recommend(props) {
    const {bannerList, recommendList} = props;
    const {getBannerDataDispatch, getRecommendListDataDispatch} = props;

    useEffect(() => {
        getBannerDataDispatch();
        getRecommendListDataDispatch();
    }, []);

    const bannerListJS = bannerList ? bannerList.toJS() : [];
    const recommendListJS = recommendList ? recommendList.toJS() : [];

    return (
        <Content>
            <Scroll className="list">
                <div>
                    <Slider bannerList={bannerListJS}></Slider>
                    <RecommendList recommendList={recommendListJS} />      
                </div>
            </Scroll>
        </Content>
    )
}

// 映射全局的 redux state 到组件的props上
const mapStateToProps = state => ({
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList'])
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = dispatch => {
    return {
        getBannerDataDispatch() {
            dispatch(actionTypes.getBannerList());
        },
        getRecommendListDataDispatch() {
            dispatch(actionTypes.getRecommendList());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));
