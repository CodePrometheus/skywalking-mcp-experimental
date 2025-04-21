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

export interface TraceSpan {
  traceId: string;
  segmentId: string;
  spanId: string;
  parentSpanId: string;
  refs: Array<{
    traceId: string;
    parentSegmentId: string;
    parentSpanId: string;
    type: string;
  }>;
  serviceCode: string;
  serviceInstanceName: string;
  startTime: number;
  endTime: number;
  endpointName: string;
  type: string;
  peer: string;
  component: string;
  isError: boolean;
  layer: string;
  tags: Array<{
    key: string;
    value: string;
  }>;
  logs: Array<{
    time: number;
    data: Array<{
      key: string;
      value: string;
    }>;
  }>;
  attachedEvents: Array<{
    startTime: {
      seconds: number;
      nanos: number;
    };
    event: string;
    endTime: {
      seconds: number;
      nanos: number;
    };
    tags: Array<{
      key: string;
      value: string;
    }>;
    summary: Array<{
      key: string;
      value: string;
    }>;
  }>;
}

export const TraceSpans = {
  variable: "$traceId: ID!",
  query: `
  query queryTrace($traceId: ID!) {
    queryTrace(traceId: $traceId) {
      spans {
        traceId
        segmentId
        spanId
        parentSpanId
        refs {
          traceId
          parentSegmentId
          parentSpanId
          type
        }
        serviceCode
        serviceInstanceName
        startTime
        endTime
        endpointName
        type
        peer
        component
        isError
        layer
        tags {
          key
          value
        }
        logs {
          time
          data {
            key
            value
          }
        }
        attachedEvents {
          startTime {
            seconds
            nanos
          }
          event
          endTime {
            seconds
            nanos
          }
          tags {
            key
            value
          }
          summary {
            key
            value
          }
        }
      }
    }
  }
  `,
} as const;

export const queryTrace = TraceSpans.query;

const query: { [key: string]: string } = {
  queryTrace,
};

export { query };
