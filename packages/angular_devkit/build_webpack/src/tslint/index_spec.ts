/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Architect, Workspace } from '@angular-devkit/architect';
import { normalize } from '@angular-devkit/core';
import { NodeJsSyncHost } from '@angular-devkit/core/node';
import { relative, resolve } from 'path';
import { concatMap, tap, toArray } from 'rxjs/operators';


describe('Tslint Target', () => {
  const devkitRoot = (global as any)._DevKitRoot; // tslint:disable-line:no-any
  const root = resolve(devkitRoot, 'tests/@angular_devkit/build_webpack/hello-world-app/');
  const builderPath = resolve(devkitRoot, 'packages/angular_devkit/build_webpack');
  const relativeBuilderPath = relative(root, builderPath);
  const host = new NodeJsSyncHost();

  const getWorkspace = (): Workspace => ({
    name: 'spec',
    version: 1,
    root: '',
    defaultProject: 'app',
    projects: {
      app: {
        root: 'src',
        projectType: 'application',
        defaultTarget: 'tslint',
        targets: {
          tslint: {
            builder: `${relativeBuilderPath}:tslint`,
            options: {
              tslintConfig: '../tslint.json',
              tsConfig: 'tsconfig.app.json',
              exclude: ['**/node_modules/**'],
            },
          },
        },
      },
    },
  });

  it('runs', (done) => {
    const architect = new Architect(normalize(root), host);
    architect.loadWorkspaceFromJson(getWorkspace()).pipe(
      concatMap((architect) => architect.run(architect.getTarget())),
      toArray(),
      tap(events => expect(events.length).toBe(0)),
    ).subscribe(done, done.fail);
  }, 30000);
});
