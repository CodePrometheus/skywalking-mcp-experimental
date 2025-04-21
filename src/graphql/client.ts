/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import axios, { AxiosPromise, AxiosResponse } from "axios";
import { query } from "./queries.js";

class Graphql {
  private queryData = "";
  private baseURL: string = process.env.SW_PROXY_TARGET || "http://127.0.0.1:12800";

  public query(queryData: string) {
    this.queryData = queryData;
    return this;
  }

  public params(variablesData: unknown): AxiosPromise<void> {
    return axios
      .post(`${this.baseURL}/graphql`, {
        query: query[this.queryData],
        variables: variablesData,
      })
      .then((res: AxiosResponse) => {
        if (res.data.errors) {
          res.data.errors = res.data.errors.map((e: { message: string }) => e.message).join(" ");
        }
        return res;
      })
      .catch((err: Error) => {
        throw err;
      });
  }
}

export default new Graphql();
