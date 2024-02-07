"use client";

import {Wrench} from 'lucide-react';
import React, {ComponentType, useState, Suspense} from 'react';
import {JSX} from "react/jsx-runtime";
import IntrinsicAttributes = JSX.IntrinsicAttributes;
import {Card, CardContent} from "@/components/ui/card";

interface WidgetGridProps extends  IntrinsicAttributes { }

// Define a generic HOC that preserves the props of the WrappedCardContent
function WidgetWrapper<T extends WidgetGridProps>(WrappedCardContent: ComponentType<T>) {
  // The returned component also receives the same props T
  const WithEditButton: React.FC<T> = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editProps, setEditProps] = useState(props);

    const toggleEdit = () => setIsEditing(!isEditing);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = event.target;
      setEditProps({...editProps, [name]: value} as T);
    };

    if (isEditing) {
      // Simplified for demonstration; you'd dynamically create inputs based on prop types
      return (
        <Card>
          <CardContent>
          {/* Example for 'text' prop; extend as needed */}
          <input
            name="text"
            value={(editProps as any).text}
            onChange={handleChange}
          />
          <button onClick={toggleEdit}>Done</button>
          </CardContent>
        </Card>
      );
    }


    return (
      <Suspense fallback={<LoadingWidget/>}>
        <Card className={"group"}>
          <CardContent>
            <WrappedCardContent {...editProps} />
            <button onClick={toggleEdit} className={"hidden group-hover:block object-right-top"}><Wrench/></button>
          </CardContent>
        </Card>
      </Suspense>
    );
  };

  return WithEditButton;
}

export default WidgetWrapper;

const LoadingWidget = () => <div>Loading...</div>;
