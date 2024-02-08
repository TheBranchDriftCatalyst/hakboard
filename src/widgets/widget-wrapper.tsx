"use client";

import { Wrench } from 'lucide-react';
import React, {ComponentType, useState, Suspense, forwardRef, useEffect} from 'react';
import { JSX } from "react/jsx-runtime";
import IntrinsicAttributes = JSX.IntrinsicAttributes;
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Component is a HOC that wraps the widget components themselves.
// It handles saving and reloading the props for each widget to local storage.
// It provides an interface (flippable cards) for editing the props of each widget.

interface WidgetGridProps extends React.HTMLAttributes<HTMLElement> {}

// Refactor WidgetWrapper to handle default props of WrappedComponent
const WidgetWrapper = <T extends object>(WrappedComponent: ComponentType<T>, defaultProps: T) => {
  // Assume WrappedComponent might have defaultProps
  // const defaultProps = WrappedComponent.defaultProps;

  const WithEditButton = forwardRef<HTMLElement, T>((props, ref) => {
    // Initialize editProps with defaultProps if they exist, then override with actual props
    const initialProps = { ...defaultProps, ...props };
    const [isEditing, setIsEditing] = useState(false);
    const [editProps, setEditProps] = useState<T>(initialProps);

    const toggleEdit = () => setIsEditing(!isEditing);

    const { toast } = useToast();

    const toggleSave = () => {
      // Save the props to local storage
      console.log('Saving props to local storage');
      toast({
        title: `Saving ${WrappedComponent.name} props`,
        description: `Saving ${Object.keys(editProps).join(', ')}`,
      })
      Object.keys(editProps).forEach((propKey: string) => {
        const serializedValue = JSON.stringify(initialProps[propKey as keyof typeof initialProps]);
        console.log('Saving', {propKey, serializedValue, editProps});
        const localStorageKey = `${WrappedComponent.name}.${propKey}`;
        localStorage.setItem(localStorageKey, serializedValue);
      });
    }

    const handleLoad = () => {
      setTimeout(() => {
        toast({
          title: `loading ${WrappedComponent.name} props`,
          description: `Loading ${Object.keys(editProps).join(', ')}`,
          action: <ToastAction altText="Try again" onClick={() => console.log("clear local storage") }>todo - clear localstorage</ToastAction>,
        })
      }, 300)
    }

    useEffect(() => {
      console.log('Loading props from local storage');
      handleLoad();
    }, [])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setEditProps({ ...editProps, [name]: value });
    };

    if (isEditing) {
      return (
        <Card className={"group"} ref={ref}>
          <CardContent>
            {Object.entries(editProps).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key}>{key}</Label>
                <Input
                  name={key}
                  value={value as any}
                  onChange={handleChange}
                />
              </div>
            ))}
            <button onClick={toggleEdit}>Done</button>
            <button onClick={toggleSave}>Save</button>
          </CardContent>
        </Card>
      );
    }

    return (
        <Card className={"group"} ref={ref}>
          <CardContent>
            <Suspense fallback={<LoadingWidget />}>
              <WrappedComponent {...editProps} />
              <button onClick={toggleEdit} className={"hidden group-hover:block content-end"}><Wrench /></button>
            </Suspense>
          </CardContent>
        </Card>
    );
  });

  WithEditButton.displayName = `WithEditButton(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  // It's not necessary to explicitly return defaultProps here as they are handled internally
  return WithEditButton;
};

export default WidgetWrapper;

const LoadingWidget = () => <div>Loading...</div>;
