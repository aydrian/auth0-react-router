import { AbstractStateStore, type EncryptedStoreOptions, type StateData } from '@auth0/auth0-server-js';
import type { SessionStorage } from 'react-router';
import type { StoreOptions } from '../types.js';

export class ReactRouterSessionStore extends AbstractStateStore<StoreOptions> {
  #store: SessionStorage;

  constructor(options: EncryptedStoreOptions, store: SessionStorage<StateData, unknown>) {
    super(options);
    this.#store = store;
  }

  async set(
    identifier: string,
    stateData: StateData,
    removeIfExists?: boolean,
    options?: StoreOptions | undefined
  ): Promise<void> {
    if (!options) {
      throw new Error('StoreOptions not provided');
    }

    const session = await this.#store.getSession(options.request.headers.get('Cookie'));

    session.set(identifier, stateData);

    options.response.headers.append('Set-Cookie', await this.#store.commitSession(session));
  }

  async get(identifier: string, options?: StoreOptions | undefined): Promise<StateData | undefined> {
    if (!options) {
      throw new Error('StoreOptions not provided');
    }

    const session = await this.#store.getSession(options.request.headers.get('Cookie'));
    return session.get(identifier);
  }

  async delete(identifier: string, options?: StoreOptions | undefined): Promise<void> {
    if (!options) {
      throw new Error('StoreOptions not provided');
    }

    const session = await this.#store.getSession(options.request.headers.get('Cookie'));

    session.unset(identifier);
    options.response.headers.append('Set-Cookie', await this.#store.commitSession(session));
  }

  deleteByLogoutToken(): Promise<void> {
    throw new Error(
      'Backchannel logout is not available when using Stateless Storage. Use Stateful Storage by providing a `sessionStore`'
    );
  }
}
