import React from 'react';
interface Props {
    tagName: string
}
const Tags = ({tagName}: Props) => {
    return (
        <div>
            {tagName}
        </div>
    );
};

export default Tags;