import { IInputs, IOutputs } from './generated/ManifestTypes';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WeatherDisplay from './WeatherDisplay';

export class Weather
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container: HTMLDivElement;

  constructor() {}

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement,
  ): void {
    this.container = container;
    this.renderReactComponent(context);
  }

  private renderReactComponent(
    context: ComponentFramework.Context<IInputs>,
  ): void {
    const zipCode = context.parameters.zipCode?.raw ?? 'defaultZipCode';
    ReactDOM.render(
      React.createElement(WeatherDisplay, { zipCode: zipCode }),
      this.container,
    );
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.renderReactComponent(context);
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    ReactDOM.unmountComponentAtNode(this.container);
  }
}
