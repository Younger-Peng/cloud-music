import React, {useState, useRef, useEffect, forwardRef, useImperativeHandle} from 'react';
import BScroll from 'better-scroll';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Loading from '../loading';
import LoadingV2 from '../loading-v2';

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
`;

const PullUpLoading = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    width: 60px;
    height: 60px;
    margin: auto;
    z-index: 100;
`;

export const PullDownLoading = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 30px;
    margin: auto;
    z-index: 100;
`;

const Scroll = forwardRef((props, ref) => {
    const [bScroll, setBScroll] = useState();
    const scrollContainerRef = useRef();

    const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;
    const { pullUp, pullDown, onScroll } = props;

    // 创建better-scroll
    useEffect(() => {
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === 'horizental',
            scrollY: direction === 'vertical',
            probeType: 3,
            click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        });

        setBScroll(scroll);
        return () => {
            setBScroll(null);
        }
    }, []);

    // 每次重新渲染，刷新实例，防止无法滑动
    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    });

    // 给实例绑定 scroll 事件
    useEffect(() => {
        if (!bScroll || !onScroll) return;
        bScroll.on('scroll', scroll => {
            onScroll(scroll);
        });
        return () => {
            bScroll.off('scroll');
        }
    }, [onScroll, bScroll]);

    // 设定上拉刷新
    useEffect(() => {
        if (!bScroll || !pullUp) return;
        bScroll.on('scrollEnd', () => {
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUp();
            }
        });
        return () => {
            bScroll.off('scrollEnd');
        };
    }, [pullUp, bScroll]);

    // 设定下拉刷新
    useEffect(() => {
        if (!bScroll || !pullDown) return;
        bScroll.on('touchEnd', (pos) => {
            if (pos.y > 50) {
                pullDown();
            }
        });

        return () => {
            bScroll.off('touchEnd');
        };
    }, [pullDown, bScroll]);

    useImperativeHandle(ref, () => ({
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        getBScroll() {
            return bScroll || null;
        }
    }));
    const pullUpDisplayStyle = pullUpLoading ? {display: ''} : {display: 'none'};
    const pullDownDisplayStyle = pullDownLoading ? {display: ''} : {display: 'none'};
    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            <PullUpLoading style={pullUpDisplayStyle}>
                <Loading></Loading>
            </PullUpLoading>
            <PullDownLoading style={pullDownDisplayStyle}>
                <LoadingV2></LoadingV2>
            </PullDownLoading>
        </ScrollContainer>
    );

});

Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizental']),
    refresh: PropTypes.bool,
    onScroll: PropTypes.func,
    pullDown: PropTypes.func,
    pullUpLoading: PropTypes.bool,
    pullDownLoading: PropTypes.bool,
    bounceTop: PropTypes.bool,
    bounceBottom: PropTypes.bool
};

Scroll.defaultProps = {
    direction: 'vertical',
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
};

export default Scroll;