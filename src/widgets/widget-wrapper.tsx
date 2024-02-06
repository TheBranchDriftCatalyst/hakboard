// WidgetWrapper.tsx
import { Wrench } from 'lucide-react';
import React, { ComponentType, useState, Suspense } from 'react';

// Define a generic HOC that preserves the props of the WrappedComponent
function WidgetWrapper<T>(WrappedComponent: ComponentType<T>) {
  // The returned component also receives the same props T
  const WithEditButton: React.FC<T> = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editProps, setEditProps] = useState(props);

    const toggleEdit = () => setIsEditing(!isEditing);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setEditProps({ ...editProps, [name]: value } as T);
    };

    if (isEditing) {
      // Simplified for demonstration; you'd dynamically create inputs based on prop types
      return (
        <div>
          {/* Example for 'text' prop; extend as needed */}
          <input
            name="text"
            value={(editProps as any).text}
            onChange={handleChange}
          />
          <button onClick={toggleEdit}>Done</button>
        </div>
      );
    }


    return (
      <Suspense fallback={<LoadingWidget />}>
        {/* @ts-ignore */}
        <WrappedComponent {...editProps} />
        <button onClick={toggleEdit}><Wrench /></button>
      </Suspense>
    );
  };

  return WithEditButton;
}

export default WidgetWrapper;

const LoadingWidget = () => <div>Loading...</div>;
