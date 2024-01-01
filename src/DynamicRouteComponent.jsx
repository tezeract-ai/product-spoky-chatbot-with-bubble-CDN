import React from 'react'
import { useParams } from 'react-router-dom';

const DynamicRouteComponent = () => {
    const { id } = useParams();
    console.log("id",id)

    return (
        <>
            <h1>Dynamic Route Component</h1>
            <p>Dynamic ID: {id}</p>

        </>
    )
}

export default DynamicRouteComponent
