import { useState, useEffect } from "react";
import {Link} from "react-router-dom";

import "./CustomButton.scss";

const CustomButton = (props) => {
    const btnClass = 'cta';
    const color = props.color ? props.color : 'blue';
    const size = props.size ? props.size : 'medium';
    const propsClass = props.className ? props.className : '';


    if(props.submit){
        return (
            <button type="submit" className={[btnClass, size, color, propsClass].join(' ')}>
                {props.children}
            </button>
        )
    }

    if(props.link){
        return (
            <button className={[btnClass, size, color, propsClass].join(' ')}>
                <Link to={props.link}>{props.children}</Link>
                {props.featured ? <span className="featured"></span> : ''}
            </button>
        )
    }
    else if(props.anchor){
        return (
            <button className={[btnClass, size, color, propsClass].join(' ')}>
                <a href={props.anchor}>
                    {props.children}
                </a>
                {props.featured ? <span className="featured"></span> : ''}
            </button>
        )
    }
    else if(props.href){
        return (
            <button className={[btnClass, size, color, propsClass].join(' ')}>
                <a href={props.href} target="_blank">
                    {props.children}
                </a>
                {props.featured ? <span className="featured"></span> : ''}
            </button>
        )
    }
    else if(props.onClick){
        return (
            <button onClick={props.onClick} className={[btnClass, size, color, propsClass].join(' ')}>
                <a href={props.href} target="_blank">
                    {props.children}
                </a>
                {props.featured ? <span className="featured"></span> : ''}
            </button>
        )
    }
    return (
        <button className={[btnClass, size, color, propsClass].join(' ')}>
            {props.children}
            {props.featured ? <span className="featured"></span> : ''}
        </button>
    );
};

export default CustomButton;